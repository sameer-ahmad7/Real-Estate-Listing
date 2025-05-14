import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ValutaOptions } from '../model/valuta-model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ValutaService {
    private apiURL=`${environment.apiURL}/custom/v1/valuta-options`;
    private _isLoading$=new BehaviorSubject<boolean>(true);
    private _valueOptions:ValutaOptions[]=[];

  constructor(private http: HttpClient) { }

  getValueOptions(){
    this.http.get<ValutaOptions[]>(this.apiURL).subscribe(values=>{
      this._valueOptions=values;
      this._isLoading$.next(false);
    });
  }

  get isLoading$(){
    return this._isLoading$.asObservable();
  }

  get valueOptions(){
    return this._valueOptions;
  }
}
