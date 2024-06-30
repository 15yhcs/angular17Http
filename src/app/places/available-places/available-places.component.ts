import { Component, DestroyRef, EventEmitter, OnDestroy, OnInit, inject, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { Subscribable, catchError, filter, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit, OnDestroy{
  places = signal<Place[] | undefined>(undefined);
  private httpClient = inject(HttpClient);
  private httpSvc = inject(PlacesService)
  isLoading = signal(false);
  isUpdating = signal(false);
  error = signal({text: "", status: false});
  private destroyRef = inject(DestroyRef)
  private header = "http://localhost:3000"
  private temp = "https://alfa-leetcode-api.onrender.com/yewin0824/badges"
  private subUserPlace$: any;
  ngOnInit(): void {
    this.isLoading = signal(true);
    const sub = this.httpSvc.loadAvailablePlaces(this.header, "Something Wroing with the server").subscribe(
      {
        next: (resData) => {
          this.places.set(resData)
        },
        error: (error: Error) => {
          this.error.set({text: error.message, status: true});
          this.isLoading.set(false);
          
        },
        complete: () =>{
          this.isLoading.set(false);
        }
      }
    );

    this.destroyRef.onDestroy(() => {
      sub.unsubscribe()
    })


    // const sub1 = this.httpClient.get(this.temp, {
    //   observe: 'response'
    // }).subscribe(
    //   {
    //     next: (resData) => {
    //       console.log(resData);
    //     },
    //     error: (error) => {
    //       console.log(error);
          
    //     }
    //   }
    // );

    // this.destroyRef.onDestroy(() => {
    //   sub1.unsubscribe()
    // })
    
  }

  ngOnDestroy(): void {
    this.subUserPlace$.unsubscribe();
  }

  onSelectPlace(event: Place){
    this.isUpdating = signal(true);
    this.subUserPlace$ = this.httpSvc.addPlaceToUserPlaces(this.header,event).subscribe({
      next: (resData) => console.log(resData),
      error: (er: Error) => this.error.set({text: er.message, status: true}),
      complete: () => this.isUpdating = signal(false)
    });
  }
}
