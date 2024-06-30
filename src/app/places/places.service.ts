import { Injectable, inject, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { Subscribable, catchError, filter, map, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
  private httpClient = inject(HttpClient)
  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces(url: string, errorMessage: string) {
    return this.fetchPlaces(url,errorMessage);
  }

  loadUserPlaces(url: string) {
    return this.fetchUserPlaces(url);
  }

  addPlaceToUserPlaces(url:string, place: Place) {
    return this.putPlaces(url, place);
  }

  removeUserPlace(place: Place) {}

  private fetchPlaces(url: string, errorMessage: string){
    return this.httpClient.get<{places: Place[]}>(url+'/places', {
    }).pipe(
        map(data => data.places), catchError((err) => {
          return throwError(() => 
            new Error(errorMessage)
          )
        } 
      )
    )
  }

  private putPlaces(url: string, event: Place){
    return this.httpClient.put(url + "/user-places", {
      placeId: event.id,
    })
  }

  private fetchUserPlaces(url: string){
    return this.httpClient.get<{places: Place[]}>(url + "/user-places").pipe((map(res => res.places)))
  }
}
