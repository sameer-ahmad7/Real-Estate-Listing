import { Injectable } from '@angular/core';
import { LandTitle } from '../model/land-title.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LandTitleService {
  private apiURL = `${environment.apiURL}/custom/v1/grondtitel-options?lang=en`;
  private _isLoading$ = new BehaviorSubject<boolean>(true);
  private _landTitles: LandTitle[] = [];
  constructor(private http: HttpClient) { }

  getLandTitles() {
    this.http.get<LandTitle[]>(this.apiURL).subscribe(landTitles => {
      this._landTitles = landTitles;
      this._isLoading$.next(false);
    })
  }

  get landTitles() {
    return [...this._landTitles];
  }

  get isLoading$() {
    return this._isLoading$.asObservable();
  }

}
