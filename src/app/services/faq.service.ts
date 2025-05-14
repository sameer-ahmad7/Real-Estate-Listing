import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FAQ, FaqType } from '../model/faq.model';

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  private apiURL=`${environment.apiURL}/wp/v2/faq`;

  constructor(private http:HttpClient) { }

  fetchFaqs(faqType:FaqType,lang:string='en'){
    const params=new HttpParams().set('faq',faqType).set('lang',lang);
   return this.http.get<FAQ[]>(this.apiURL,{params});
  }

}
