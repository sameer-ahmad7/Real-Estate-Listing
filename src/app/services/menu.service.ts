import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NavMenu } from '../model/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private apiURL=`${environment.apiURL}/custom/v1/menu`

  constructor(private http:HttpClient) { }

  fetchMainMenu(language:string='en'){
    let id='184';
    if(language==='nl'){
      id='4'
    }
    const url=`${this.apiURL}/${id}`;
  return  this.http.get<NavMenu[]>(url);
  }
}
