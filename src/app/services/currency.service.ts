import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiURL = `${environment.apiURL}/currency/v1/convert`;

  constructor(private http: HttpClient) { }

  convertPrice(amount: string, to: string, from: string = 'eur') {
    let params = new HttpParams();
    params = params.set('amount', amount)
    params = params.set('from', from);
    params = params.set('to', to);
    params = params.set('dp', 0);

    return this.http.get<{ 'converted_price': string }>(this.apiURL, { params }).pipe(
      map(res=>{
        if(res && res.converted_price){
          const converted_price=res.converted_price.replace(/,/g, '');
          res.converted_price=converted_price;
        }
        return res;
      })
    );

  }

}
