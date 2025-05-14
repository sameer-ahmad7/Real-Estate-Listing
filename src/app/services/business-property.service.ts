import { Injectable } from '@angular/core';
import { BusinessProperty, BusinessType } from '../model/business-property.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BusinessPropertyFilter, IFilter } from '../model/filter.model';
import { District } from '../model/districts.model';
import { business } from 'ionicons/icons';
import { ValueTypes, ValutaOptions } from '../model/valuta-model';

@Injectable({
  providedIn: 'root'
})
export class BusinessPropertyService {

  private apiURL = `${environment.apiURL}/wp/v2/kooppand`;
  private apiRentURL = `${environment.apiURL}/wp/v2/huurpand`;
  private businessTypesURL = `${environment.apiURL}/custom/v1/type-zakenpand-options?lang=en`;

  private _businessTypes$ = new BehaviorSubject<BusinessType[]>([]);
  private _businessTypesLoading$ = new BehaviorSubject<boolean>(true);
  private _businessTypes: BusinessType[] = [];


  constructor(private http: HttpClient) { }

  getLatestProperties(): Observable<BusinessProperty[]> {
    const params = new HttpParams()
      .set('per_page', '5') // Limit to 5 posts
      .set('orderby', 'date') // Sort by date
      .set('order', 'desc'); // Descending order (newest first)

    return this.http.get<BusinessProperty[]>(this.apiURL, { params });
  }

  onApplyRentPropertyDetailedFilter(filter: BusinessPropertyFilter | null, districts: District[], valutas: ValutaOptions[], perPage: number = 10, currentPageNo: number = 1, listingCheck: number = 0) {
    let params = new HttpParams();
    params = params.set('orderby', 'date') // Sort by date
    params = params.set('order', 'desc'); // Descending order (newest first)
    if (listingCheck) {
      params = params.set('listingCheck', listingCheck);
    }
    if (currentPageNo) {
      params = params.set('page', currentPageNo);
    }
    if (perPage > 0) {
      params = params.set('per_page', perPage) // Limit to 5 posts
    }

    if (filter) {
      if (filter.search && filter.search.trim() && filter.search.toLowerCase()) {
        params = params.set('search', filter.search);
      }
      if(filter.propertyType){
        params = params.set('propertyType', filter.propertyType);
      }
      if (filter.priceRange) {
        params = params.set('price', `${filter.priceRange}`);
      }
      if (filter.plotArea) {
          params = params.set('landArea', `${filter.plotArea}`);
      }
      if (filter.constructionArea) {
        params = params.set('constructionArea', `${filter.constructionArea}`);
      }      if (filter.district) {
        params = params.set('district', filter.district);
      }



    }
    return this.http.get<BusinessProperty[]>(this.apiRentURL, { params }).pipe(map(properties => this.populateBusinessPropertyDistrict(properties, districts, valutas)),
      catchError(() => of([])));
  }



  onApplyBuyPropertyDetailedFilter(filter: BusinessPropertyFilter | null, districts: District[], valutas: ValutaOptions[], perPage: number = 10, currentPageNo: number = 1, listingCheck: number = 0) {
    let params = new HttpParams();
    params = params.set('orderby', 'date') // Sort by date
    params = params.set('order', 'desc'); // Descending order (newest first)
    if (listingCheck) {
      params = params.set('listingCheck', listingCheck);
    }

    if (currentPageNo) {
      params = params.set('page', currentPageNo);
    }
    if (perPage > 0) {
      params = params.set('per_page', perPage) // Limit to 5 posts
    }

    if (filter) {
      if (filter.search && filter.search.trim() && filter.search.toLowerCase()) {
        params = params.set('search', filter.search);
      }

      if(filter.propertyType){
        params = params.set('propertyType', filter.propertyType);
      }

      if (filter.priceRange) {
        params = params.set('price', `${filter.priceRange}`);
      }
      if (filter.plotArea) {
          params = params.set('landArea', `${filter.plotArea}`);
      }
      if (filter.constructionArea) {
        params = params.set('constructionArea', `${filter.constructionArea}`);
      }
      if (filter.district) {
        params = params.set('district', filter.district);
      }
      if (filter.landTitle) {
        params = params.set('landTitle', filter.landTitle);
      }
    }
    return this.http.get<BusinessProperty[]>(this.apiURL, { params }).pipe(map(properties => this.populateBusinessPropertyDistrict(properties, districts, valutas),

    ), catchError(() => of([])));
  }


  onApplyBuyBusinessPropertyFilter(filter: IFilter, districts: District[], valutas: ValutaOptions[], perPage: number = 10, currentPageNo: number = 1, listingCheck: number = 0) {
    let params = new HttpParams();
    params = params.set('orderby', 'date') // Sort by date
    params = params.set('order', 'desc'); // Descending order (newest first)

    if (currentPageNo) {
      params = params.set('page', currentPageNo);
    }
    if (perPage > 0) {
      params = params.set('per_page', perPage) // Limit to 5 posts
    }
    if (listingCheck) {
      params = params.set('listingCheck', listingCheck);
    }


    if (filter) {
      if (filter.search && filter.search.trim() && filter.search.toLowerCase()) {
        params = params.set('search', filter.search);
      }
      if (filter.excludeId) {
        params = params.set('exclude_id', filter.excludeId);
      }

      if (filter.priceRange) {
        params = params.set('price', `${filter.priceRange}`);
      }
    }
    return this.http.get<BusinessProperty[]>(this.apiURL, { params }).pipe(map(properties => this.populateBusinessPropertyDistrict(properties, districts, valutas),
    ), catchError(() => of([])));
  }

  onApplyRentalBusinessPropertyFilter(filter: IFilter, districts: District[], valutas: ValutaOptions[], perPage: number = 10, currentPageNo: number = 1, listingCheck: number = 0) {
    let params = new HttpParams();
    params = params.set('orderby', 'date') // Sort by date
    params = params.set('order', 'desc'); // Descending order (newest first)
    if (currentPageNo) {
      params = params.set('page', currentPageNo);
    }
    if (perPage > 0) {
      params = params.set('per_page', perPage) // Limit to 5 posts
    }

    if (listingCheck) {
      params = params.set('listingCheck', listingCheck);
    }

    if (filter) {
      if (filter.search && filter.search.trim() && filter.search.toLowerCase()) {
        params = params.set('search', filter.search);
      }
      if (filter.excludeId) {
        params = params.set('exclude_id', filter.excludeId);
      }

      if (filter.priceRange) {
        params = params.set('price', `${filter.priceRange}`);
      }
    }
    return this.http.get<BusinessProperty[]>(this.apiRentURL, { params }).pipe(map(properties => this.populateBusinessPropertyDistrict(properties, districts, valutas),

    ), catchError(() => of([])));
  }

  getBusinessTypes() {
    this._businessTypes = [];
    this.http.get<BusinessType[]>(this.businessTypesURL).pipe(take(1))
      .subscribe(businessTypes => {
        for (const businessType of businessTypes) {
          this._businessTypes.push({
            label: businessType.label,
            value: businessType.value,
          })
        }
        this._businessTypes$.next(this._businessTypes);
        this._businessTypesLoading$.next(false);
      })
  }

  getPropertyById(id: string, districts: District[], valutas: ValutaOptions[], isRental: boolean = false) {
    let url = this.apiURL;
    if (isRental) {
      url = this.apiRentURL;
    }
    return this.http.get<BusinessProperty>(`${url}/${id}`).pipe(map(business => this.populateBusinessPropertyDistrict([business], districts, valutas)[0]));
  }


  populateBusinessPropertyDistrict(businessProperties: BusinessProperty[], districts: District[], valutas: ValutaOptions[]) {
    for (const businessProperty of businessProperties) {
      const valuta = businessProperty['wpcf-valuta'];
      if (valuta) {
        const value = valutas.find(d => d.value === valuta);
        if (value) {
          if (value.label === ValueTypes.EUR) {
            businessProperty.isEuro = true;
          } else if (value.label === ValueTypes.USD) {
            businessProperty.isUsd = true;
          } else {
            businessProperty.isSrd = true;
          }
        }
      }

      const businessDistrict = businessProperty['wpcf-district'];
      if (businessDistrict) {
        const district = districts.find(d => d.value === businessDistrict);
        if (district) {
          businessProperty.district = district.title;
        }
      }
    }
    return businessProperties;

  }

  get businessTypesLoading$() {
    return this._businessTypesLoading$.asObservable();
  }

  get businessTypes() {
    return [...this._businessTypes];
  }


}
