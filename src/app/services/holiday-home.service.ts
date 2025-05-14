import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Home } from '../model/home.model';
import { HolidayHomeFilter, IFilter } from '../model/filter.model';
import { Pricing } from '../model/price.model';
import { HolidayHome } from '../model/holiday-home.model';
import { District } from '../model/districts.model';
import { ValueTypes, ValutaOptions } from '../model/valuta-model';

@Injectable({
  providedIn: 'root'
})
export class HolidayHomeService {

  private apiURL = `${environment.apiURL}/wp/v2/vakantiewoning`;


  constructor(private http: HttpClient) { }

  onApplyDetailedFilter(filter: HolidayHomeFilter | null, districts: District[], valutas: ValutaOptions[], perPage: number = 10, currentPageNo: number = 1) {
    let params = new HttpParams();
    params = params.set('orderby', 'date') // Sort by date
    params = params.set('order', 'desc'); // Descending order (newest first)
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
      if (filter.priceRange) {
        params = params.set('price', `${filter.priceRange}`);
      }
      if (filter.district) {
        params = params.set('district', filter.district);
      }
      if (filter.type) {
        params = params.set('houseType', filter.type);
      }



    }
    return this.http.get<HolidayHome[]>(this.apiURL, { params }).pipe(map(homes => this.populateHolidayHomesDistrictAndValues(homes, districts, valutas),

    ), catchError(() => of([])));
  }


  getHomeById(id: string, districts: District[], valutas: ValutaOptions[]) {
    const url = `${this.apiURL}/${id}`;
    return this.http.get<HolidayHome>(url).pipe(map(home => this.populateHolidayHomesDistrictAndValues([home], districts, valutas)[0]));
  }


  onApplyFilter(filter: IFilter, districts: District[], valutas: ValutaOptions[], perPage: number = 10, currentPageNo: number = 1, listingCheck: number = 0) {
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
        params = params.set('price', `${filter.priceRange}`);
      }
    }
    return this.http.get<HolidayHome[]>(this.apiURL, { params }).pipe(map(homes => this.populateHolidayHomesDistrictAndValues(homes, districts, valutas),
    ), catchError(() => of([])),
    );
  }

  populateHolidayHomesDistrictAndValues(holidayHomes: HolidayHome[], districts: District[], valutas: ValutaOptions[]) {

    for (const holidayHome of holidayHomes) {
      const valuta = holidayHome['wpcf-valuta'];
      if (valuta) {
        const value = valutas.find(d => d.value === valuta);
        if (value) {
          if (value.label === ValueTypes.EUR) {
            holidayHome.isEuro = true;
          } else if (value.label === ValueTypes.USD) {
            holidayHome.isUsd = true;
          } else {
            holidayHome.isSrd = true;
          }
        }
      }

      const holidayHomeDistrict = holidayHome['wpcf-district'];
      if (holidayHomeDistrict) {
        const district = districts.find(d => d.value === holidayHomeDistrict);
        if (district) {
          holidayHome.district = district.title;
        }
      }
    }
    return holidayHomes;

  }


}
