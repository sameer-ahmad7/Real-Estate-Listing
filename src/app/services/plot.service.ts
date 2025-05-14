import { Injectable } from '@angular/core';
import { Plot } from '../model/plot.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IFilter, PlotFilter } from '../model/filter.model';
import { District } from '../model/districts.model';
import { ValueTypes, ValutaOptions } from '../model/valuta-model';

@Injectable({
  providedIn: 'root'
})
export class PlotService {

  private apiURL = `${environment.apiURL}/wp/v2/perceel`;

  constructor(private http: HttpClient) { }

  getLatestPlots(): Observable<Plot[]> {
    const params = new HttpParams()
      .set('per_page', '5') // Limit to 5 posts
      .set('orderby', 'date') // Sort by date
      .set('order', 'desc'); // Descending order (newest first)

    return this.http.get<Plot[]>(this.apiURL, { params });
  }

  onApplyBuyPlotDetailedFilter(filter: PlotFilter | null, districts: District[],valutas:ValutaOptions[], perPage: number = 10, currentPageNo: number = 1,listingCheck:number=0) {
    let params = new HttpParams();
    params = params.set('orderby', 'date') // Sort by date
    params = params.set('order', 'desc'); // Descending order (newest first)
    if(listingCheck){
      params=params.set('listingCheck',listingCheck);
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
      if (filter.priceRange) {
          params = params.set('price', `${filter.priceRange}`);

      }
      if (filter.plotArea) {
          params = params.set('landArea', `${filter.plotArea}`);
      }
      if (filter.district) {
        params = params.set('district', filter.district);
      }
      if (filter.landTitle) {
        params = params.set('landTitle', filter.landTitle);
      }


    }
    return this.http.get<Plot[]>(this.apiURL, { params }).pipe(map(plots => this.populatePlotDistrictsAndValues(plots, districts,valutas),

    ), catchError(() => of([])));
  }

  getPlotById(id: string, districts: District[],valutas:ValutaOptions[]) {
    const url = `${this.apiURL}/${id}`;
    return this.http.get<Plot>(url).pipe(map(plot => this.populatePlotDistrictsAndValues([plot], districts,valutas)[0]));
  }


  onApplyBuyPlotFilter(filter: IFilter, districts: District[], valutas:ValutaOptions[], perPage: number = 10, currentPageNo: number = 1,listingCheck:number=0) {
    let params = new HttpParams();
    params = params.set('orderby', 'date') // Sort by date
    params = params.set('order', 'desc'); // Descending order (newest first)
    if (currentPageNo) {
      params = params.set('page', currentPageNo);
    }
    if (perPage > 0) {
      params = params.set('per_page', perPage) // Limit to 5 posts
      params = params.set('orderby', 'date') // Sort by date
      params = params.set('order', 'desc'); // Descending order (newest first)
    }
    if(listingCheck){
      params=params.set('listingCheck',listingCheck);
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
    return this.http.get<Plot[]>(this.apiURL, { params }).pipe(map(plots => this.populatePlotDistrictsAndValues(plots, districts,valutas),
    ), catchError(() => of([])));
  }

  populatePlotDistrictsAndValues(plots: Plot[], districts: District[],valutas:ValutaOptions[]) {
    for (const plot of plots) {
            const valuta=plot['wpcf-valuta'];
            if(valuta){
              const value=valutas.find(d=>d.value===valuta);
              if(value){
                if(value.label===ValueTypes.EUR){
                  plot.isEuro=true;
                }else if(value.label===ValueTypes.USD){
                  plot.isUsd=true;
                }else{
                  plot.isSrd=true;
                }
              }
            }

      const plotDistrict = plot['wpcf-district'];
      if (plotDistrict) {
        const district = districts.find(d => d.value === plotDistrict);
        if (district) {
          plot.district = district.title;
        }
      }
    }
    return plots;

  }


}
