import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { District } from '../model/districts.model';
import { ValueTypes, ValutaOptions } from '../model/valuta-model';
import { catchError, map, of } from 'rxjs';
import { AuctionProperty } from '../model/auction.model';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {

  private apiURL = `${environment.apiURL}/wp/v2/veilingen`;

  constructor(private http:HttpClient) {}

  getAuctions( districts: District[],valutas:ValutaOptions[],active:boolean=true){
        let params = new HttpParams();
        params = params.set('orderby', 'date') // Sort by date
        params = params.set('order', 'desc'); // Descending order (newest first)
        if(!active){
          params=params.set('auction',2);
        }else{
          params=params.set('auction',1);
        }
        return this.http.get<AuctionProperty[]>(this.apiURL,{params}).pipe(map(properties=>this.populateAuctionPropertyDistrict(properties, districts,valutas),
            ), catchError(() => of([])));

  }

  getAuctionById(id:string,districts: District[],valutas:ValutaOptions[]){
    return this.http.get<AuctionProperty>(`${this.apiURL}/${id}`).pipe(map(property=>this.populateAuctionPropertyDistrict([property],districts,valutas)[0]));
  }

    populateAuctionPropertyDistrict(auctionProperties: AuctionProperty[], districts: District[],valutas:ValutaOptions[]) {
      for (const auctionProperty of auctionProperties) {
              const valuta=auctionProperty['wpcf-valuta'];
              if(valuta){
                const value=valutas.find(d=>d.value===valuta);
                if(value){
                  if(value.label===ValueTypes.EUR){
                    auctionProperty.isEuro=true;
                  }else if(value.label===ValueTypes.USD){
                    auctionProperty.isUsd=true;
                  }else{
                    auctionProperty.isSrd=true;
                  }
                }
              }

        const auctionDistrict = auctionProperty['wpcf-district'];
        if (auctionDistrict) {
          const district = districts.find(d => d.value === auctionDistrict);
          if (district) {
            auctionProperty.district = district.title;
          }
        }
      }
      return auctionProperties;

    }


}


