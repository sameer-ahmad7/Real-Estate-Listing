import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { District } from '../model/districts.model';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {
  private apiURL = `${environment.apiURL}/custom/v1/districts`;
  private _isLoading$ = new BehaviorSubject<boolean>(true);
  private _districts: District[] = [];
  constructor(private http: HttpClient) { }

  getDistricts() {
    this._districts = [];
    this.http.get(this.apiURL).pipe(take(1))
      .subscribe((districts: any) => {
        if (Object.keys(districts).length > 0) {
          for (const key in districts) {
            this._districts.push({
              title: districts[key].title,
              value: districts[key].value
            })
          }
        }
        this._isLoading$.next(false);
      })
  }

  get isLoading$() {
    return this._isLoading$.asObservable();
  }

  get districts() {
    return [...this._districts];
  }
}
