import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Home, HomeTypes, HouseStatus } from '../model/home.model';
import { HouseFilter, IFilter } from '../model/filter.model';
import { Pricing } from '../model/price.model';
import { District } from '../model/districts.model';
import { ValueTypes, ValutaOptions } from '../model/valuta-model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private apiBuyURL = `${environment.apiURL}/wp/v2/koopwoning`;
  private apiRentURL = `${environment.apiURL}/wp/v2/huurwoning`
  private homeTypesURL = `${environment.apiURL}/custom/v1/type-woning-options?lang=en`

  private _homeTypes$ = new BehaviorSubject<HomeTypes[]>([]);
  private _homeTypesLoading$ = new BehaviorSubject<boolean>(true);
  private _homeTypes: HomeTypes[] = [];


  constructor(private http: HttpClient) { }

  getHouseStatus() {
    let params = new HttpParams();
    params = params.set('lang', 'en');
    const apiURL = `${environment.apiURL}/custom/v1/koopobject-status-options`;
    return this.http.get<HouseStatus[]>(apiURL, { params }).pipe(map(statuses => statuses.filter(s => s.value !== 'unknown')));
  }

  getRentalHouseStatus() {
    let params = new HttpParams();
    params = params.set('lang', 'en');
    const apiURL = `${environment.apiURL}/custom/v1/huurobject-status-options`;
    return this.http.get<HouseStatus[]>(apiURL, { params }).pipe(map(statuses => statuses.filter(s => s.value !== 'unknown')));
  }


  getHomeTypes() {
    this._homeTypes = [];
    this.http.get(this.homeTypesURL).pipe(take(1))
      .subscribe((homeTypes: any) => {
        if (Object.keys(homeTypes).length > 0) {
          for (const key in homeTypes) {
            const value = homeTypes[key].value;

            this._homeTypes.push({
              title: homeTypes[key].title,
              value: homeTypes[key].value,
              order: parseInt(value)
            })
          }
        }
        this._homeTypes$.next(this._homeTypes);
        this._homeTypesLoading$.next(false);
      })

  }

  getPropertyById(id: string, districts: District[], valutas: ValutaOptions[], isRental: boolean = false) {
    let url = this.apiBuyURL;
    if (isRental) {
      url = this.apiRentURL;
    }
    return this.http.get<Home>(`${url}/${id}`).pipe(map(home => this.populateHomeDistrictAndValues([home], districts, valutas)[0]));
  }

  onApplyRentHomeDetailedFilter(filter: HouseFilter | null, districts: District[], valutas: ValutaOptions[], perPage: number = 10, currentPageNo: number = 1, listingCheck: number = 0) {
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
      if (filter.type) {
        params = params.set('houseType', filter.type);
      }



    }
    return this.http.get<Home[]>(this.apiRentURL, { params }).pipe(map(homes => this.populateHomeDistrictAndValues(homes, districts, valutas),

    ), catchError(() => of([])));
  }



  onApplyBuyHomeDetailedFilter(filter: HouseFilter | null, districts: District[], valutas: ValutaOptions[], perPage: number = 10, currentPageNo: number = 1, listingCheck: number = 0) {
    let params = new HttpParams();
    params = params.set('orderby', 'date') // Sort by date
    params = params.set('order', 'desc'); // Descending order (newest first)
    if (currentPageNo) {
      params = params.set('page', currentPageNo);
    }
    if (listingCheck) {
      params = params.set('listingCheck', listingCheck);
    }

    if (perPage > 0) {
      params = params.set('per_page', perPage) // Limit to 5 posts
    }

    if (filter) {
      if (filter.search && filter.search.trim() && filter.search.toLowerCase()) {
        params = params.set('search', filter.search);
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
      if (filter.type) {
        params = params.set('houseType', filter.type);
      }



    }
    return this.http.get<Home[]>(this.apiBuyURL, { params }).pipe(map(homes => this.populateHomeDistrictAndValues(homes, districts, valutas),

    ), catchError(() => of([])));
  }


  onApplyBuyHomeFilter(filter: IFilter | null, districts: District[], valutas: ValutaOptions[], perPage: number = 10, currentPageNo: number = 1, listingCheck: number = 0) {
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
    return this.http.get<Home[]>(this.apiBuyURL, { params }).pipe(map(homes => this.populateHomeDistrictAndValues(homes, districts, valutas),

    ), catchError(() => of([])));
  }

  onApplyRentHomeFilter(filter: IFilter | null, districts: District[], valutas: ValutaOptions[], perPage: number = 10, currentPageNo: number = 1, listingCheck: number = 0) {
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

      if (filter.excludeId) {
        params = params.set('exclude_id', filter.excludeId);
      }

      if (filter.search && filter.search.trim() && filter.search.toLowerCase()) {
        params = params.set('search', filter.search);
      }
      if (filter.priceRange) {
        if (filter.priceRange.includes('-')) {
          const priceRange = filter.priceRange.split('-');
          const startPrice = parseInt(priceRange[0].trim());
          const endPrice = parseInt(priceRange[1].trim());
          params = params.set('price', `=${startPrice}-${endPrice}`);
        } else if (filter.priceRange.includes('+')) {
          const priceRange = filter.priceRange.split('+');
          const startPrice = priceRange[0].trim();
          params = params.set('price', `>=${startPrice}`)
        } else if (filter.priceRange.includes('up to')) {
          const priceRange = filter.priceRange.split('up to');
          const startPrice = priceRange[1].trim();
          params = params.set('price', `<=${startPrice}`);
        }
      }
    }
    return this.http.get<Home[]>(this.apiRentURL, { params }).pipe(map(homes => this.populateHomeDistrictAndValues(homes, districts, valutas),
    ), catchError(() => of([])));
  }

  populateHomeDistrictAndValues(homes: Home[], districts: District[], valutas: ValutaOptions[]) {
    for (const home of homes) {
      const homeDistrict = home['wpcf-district'];
      const valuta = home['wpcf-valuta'];
      if (valuta) {
        const value = valutas.find(d => d.value === valuta);
        if (value) {
          if (value.label === ValueTypes.EUR) {
            home.isEuro = true;
          } else if (value.label === ValueTypes.USD) {
            home.isUsd = true;
          } else {
            home.isSrd = true;
          }
        }
      }
      if (homeDistrict) {
        const district = districts.find(d => d.value === homeDistrict);
        if (district) {
          home.district = district.title;
        }
      }
    }
    return homes;
  }


  get homeTypes$() {
    return this._homeTypes$.asObservable();
  }

  get homeTypesLoading$() {
    return this._homeTypesLoading$.asObservable();
  }

  get homeTypes() {
    return this._homeTypes;
  }


}
