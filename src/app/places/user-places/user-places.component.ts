import { Component, DoCheck, OnDestroy, OnInit, inject, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit, OnDestroy{
  places = signal<Place[]>([]);
  private sub:any
  private sub1:any
  private httpSvc = inject(PlacesService);
  private header = "http://localhost:3000"
  constructor(private httpClient: HttpClient){

  }
  
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.sub1.unsubscribe();
  }

  ngOnInit(): void {
    this.sub = this.httpSvc.loadUserPlaces(this.header).subscribe({
      next: res => this.places.set(res),
      error:error => console.log(error),
      complete: () => console.log("Complete")
    })
  }
}
