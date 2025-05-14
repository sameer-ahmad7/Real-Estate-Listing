import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";
import { Pricing } from "../model/price.model";

@Injectable({
  providedIn: 'root'
})
export class PricingService {

  private apiBuyURL=`${environment.apiURL}/custom/v1/koopobject-prijscategorie-options`;
  private apiRentalURL=`${environment.apiURL}/custom/v1/huurobject-prijscategorie-options`;
  private _buyPricings:Pricing[]=[];
  private _rentalPricings:Pricing[]=[];
  private _isBuyPriceLoading$=new BehaviorSubject<boolean>(true);
  private _isRentalPriceLoading$=new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient) { }

  getBuyPrices(){
    this.http.get(this.apiBuyURL).subscribe((prices:any)=>{
      if (Object.keys(prices).length > 0) {
        for (const key in prices) {
          if(key!=='default'){
            const value=prices[key].value ;
            const title=prices[key].title;
            this._buyPricings.push({
              order:parseInt(value),
              name:title.replace(/\./g, ',').replace(/\btot\b/g, 'up to'),
              value
            })
          }
        }
        this._buyPricings.sort((a,b)=>a.order-b.order);
      }
      this._isBuyPriceLoading$.next(false);
    })
  }

  getRentalPricings(){
    this.http.get(this.apiRentalURL).subscribe((prices:any)=>{
      if (Object.keys(prices).length > 0) {
        for (const key in prices) {
          if(key!=='default'){
            const value=prices[key].value ;
            const title=prices[key].title;
            this._rentalPricings.push({
              order:parseInt(value),
              name:title.replace(/\./g, ',').replace(/\btot\b/g, 'up to'),
              value
            })
          }
        }
        this._rentalPricings.sort((a,b)=>a.order-b.order);
      }
      this._isRentalPriceLoading$.next(false);
    })

  }

  get rentalPricings(){
    return this._rentalPricings;
  }

  get buyPricings(){
    return this._buyPricings;
  }

  get buyPriceLoading$(){
    return this._isBuyPriceLoading$.asObservable();
  }

  get rentalPriceLoading$(){
    return this._isRentalPriceLoading$.asObservable();
  }


}
