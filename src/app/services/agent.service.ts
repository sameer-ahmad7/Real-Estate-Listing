import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AgentInfo, AgentListing } from '../model/agent-model';
import { catchError, combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { MediaService } from './media.service';
import { PostMedia } from '../model/media.model';
import { Home } from '../model/home.model';
import { HomeService } from './home.service';
import { ValutaOptions } from '../model/valuta-model';
import { District } from '../model/districts.model';
import { PlotService } from './plot.service';
import { Plot } from '../model/plot.model';
import { BusinessPropertyService } from './business-property.service';
import { BusinessProperty } from '../model/business-property.model';
import { HolidayHomeService } from './holiday-home.service';
import { HolidayHome } from '../model/holiday-home.model';

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  private apiURL = `${environment.apiURL}/custom/v1/makelaar`
  private listingURL = `${environment.apiURL}/wp/v2/makelaar`;
  private homeURL=`${environment.apiURL}/custom/v1/koopwoningen_by_makelaar`;
  private rentalHomeURL=`${environment.apiURL}/custom/v1/huurwoningen_by_makelaar`;
  private plotURL=`${environment.apiURL}/custom/v1/percelen_by_makelaar`;
  private businessURL=`${environment.apiURL}/custom/v1/kooppanden_by_makelaar`;
  private rentalBusinessURL=`${environment.apiURL}/custom/v1/huurpanden_by_makelaar`;
  private vacationRentalURL=`${environment.apiURL}/custom/v1/vakantiewoningen_by_makelaar`;


  constructor(private http: HttpClient, private mediaService: MediaService,
    private businessService:BusinessPropertyService,private holidayHomeService:HolidayHomeService,
    private homeService:HomeService,private plotService:PlotService) { }

  getMakeelarById(id: number) {
    let agentResult:AgentListing;
    return this.http.get<AgentListing>(`${this.listingURL}/${id}`).pipe(
      switchMap(agent => {
        agentResult=agent;
        if (agent['featured_media']) {
          return this.mediaService.getMediaDetails(agent['featured_media']).pipe(
            map(media => {
            const agent: AgentInfo={
              id: agentResult.id,
              tel: agentResult['toolset-meta']['makelaar-id']['makelaar-tel'].raw,
              email: agentResult['toolset-meta']['makelaar-id']['makelaar-mail'].raw,
              title: agentResult.title.rendered,
              image: ''
            }
              if (media) {
                    agent.image=media.media_details.sizes.full.source_url;

            }
            return agent;
          }
    )
          );
        }
        return of(agentResult);
      }
      ),
      catchError(_ => {
      return of(null);
    }));
  }

  getRentalVacationPropertiesById(id:number,districts:District[],valutas:ValutaOptions[]){
    const params=new HttpParams().set('id',id);
    return this.http.get<HolidayHome[]>(this.vacationRentalURL,{params}).pipe(map(properties => this.holidayHomeService.populateHolidayHomesDistrictAndValues(properties, districts, valutas),
  ), catchError(() => of([])));

  }


  getRentalBusinessPropertiesById(id:number,districts:District[],valutas:ValutaOptions[]){
    const params=new HttpParams().set('id',id);
    return this.http.get<BusinessProperty[]>(this.rentalBusinessURL,{params}).pipe(map(businesses => this.businessService.populateBusinessPropertyDistrict(businesses, districts, valutas),
  ), catchError(() => of([])));

  }


  getBusinessPropertiesById(id:number,districts:District[],valutas:ValutaOptions[]){
    const params=new HttpParams().set('id',id);
    return this.http.get<BusinessProperty[]>(this.businessURL,{params}).pipe(map(businesses => this.businessService.populateBusinessPropertyDistrict(businesses, districts, valutas),
  ), catchError(() => of([])));

  }

  getPlotsById(id:number,districts:District[],valutas:ValutaOptions[]){
    const params=new HttpParams().set('id',id);
    return this.http.get<Plot[]>(this.plotURL,{params}).pipe(map(plots => this.plotService.populatePlotDistrictsAndValues(plots, districts, valutas),
  ), catchError(() => of([])));


  }

  getRentalHomesById(id:number,districts: District[], valutas: ValutaOptions[]){
    const params=new HttpParams().set('id',id);
    return this.http.get<Home[]>(this.rentalHomeURL,{params}).pipe(map(homes => this.homeService.populateHomeDistrictAndValues(homes, districts, valutas),
  ), catchError(() => of([])));

  }


  getHomesById(id:number,districts: District[], valutas: ValutaOptions[]){
    const params=new HttpParams().set('id',id);
    return this.http.get<Home[]>(this.homeURL,{params}).pipe(map(homes => this.homeService.populateHomeDistrictAndValues(homes, districts, valutas),
  ), catchError(() => of([])));

  }

  getMakeelars() {
    let agentResults: AgentListing[] = [];
    return this.http.get<AgentListing[]>(this.listingURL).pipe(
      switchMap(agents => {
        agentResults = agents;
        if (agents.length > 0) {
          const obs$: Observable<PostMedia>[] = [];
          for (const agent of agents) {
            obs$.push(this.mediaService.getMediaDetails(agent['featured_media']));
          }
          return combineLatest(obs$);
        }
        return of([]);

      }),
      map(medias => {
        const agents: AgentInfo[] = [];
        if (medias.length > 0) {
          for (const media of medias) {
            const agentResult = agentResults.find(a => a.id === media.post);
            if (agentResult) {
              agents.push({
                id: agentResult.id,
                tel: agentResult['toolset-meta']['makelaar-id']['makelaar-tel'].raw,
                email: agentResult['toolset-meta']['makelaar-id']['makelaar-mail'].raw,
                title: agentResult.title.rendered,
                image: media.media_details.sizes.full.source_url
              })
            }
          }
        }
        return agents;
      })
    );
  }

  getMakeelarFromHouseListing(id: string) {
    let params = new HttpParams();
    params = params.set('id', id);
    return this.http.get<AgentInfo>(`${this.apiURL}_koopwoning`, { params }).pipe(catchError(_ => {
      return of(null);
    }));
  }

  getMakeelarFromPlotListing(id: string) {
    let params = new HttpParams();
    params = params.set('id', id);
    return this.http.get<AgentInfo>(`${this.apiURL}_perceel`, { params }).pipe(catchError(_ => {
      return of(null);
    }));
  }

  getMakeelarFromVacationListing(id: string) {
    let params = new HttpParams();
    params = params.set('id', id);
    return this.http.get<AgentInfo>(`${this.apiURL}_vakantiewoning`, { params }).pipe(catchError(_ => {
      return of(null);
    }));
  }


  getMakeelarFromRentalHouseListing(id: string) {
    let params = new HttpParams();
    params = params.set('id', id);
    return this.http.get<AgentInfo>(`${this.apiURL}_huurwoning`, { params }).pipe(catchError(_ => {
      return of(null);
    }));
  }

  getMakeelarFromBusinessListing(id: string) {
    let params = new HttpParams();
    params = params.set('id', id);
    return this.http.get<AgentInfo>(`${this.apiURL}_kooppand`, { params }).pipe(catchError(_ => {
      return of(null);
    }));

  }

  getMakeelarFromBusinessRentalListing(id: string) {
    let params = new HttpParams();
    params = params.set('id', id);
    return this.http.get<AgentInfo>(`${this.apiURL}_huurpand`, { params }).pipe(catchError(_ => {
      return of(null);
    }));

  }


}
