import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Rental } from '../model/rental.model';

@Injectable({
  providedIn: 'root'
})
export class RentService {

  private apiURL = `${environment.apiURL}/wp/v2/huurwoning`;

  constructor(private http: HttpClient) { }

  getLatestRentals(): Observable<Rental[]> {
    const params = new HttpParams()
      .set('per_page', '5') // Limit to 5 posts
      .set('orderby', 'date') // Sort by date
      .set('order', 'desc'); // Descending order (newest first)

    return this.http.get<Rental[]>(this.apiURL, { params });
  }
}
