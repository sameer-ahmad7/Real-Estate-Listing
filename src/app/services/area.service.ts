import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BuildingArea, LandArea } from '../model/area-model';
import { BehaviorSubject, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private buildingApiURL = `${environment.apiURL}/custom/v1/percelopp-categorie-options?lang=en`;
  private plotApiURL = `${environment.apiURL}/custom/v1/bouwopp-categorie-options?lang=en`;

  private _buildingArea: BuildingArea[] = [];
  private _plotArea: LandArea[] = [];

  private _buildingArea$ = new BehaviorSubject<BuildingArea[]>([]);
  private _plotArea$ = new BehaviorSubject<LandArea[]>([]);

  private _buildingAreaLoading$ = new BehaviorSubject<boolean>(true);
  private _plotAreaLoading$ = new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient) { }

  //Plot
  getBuildingArea() {
    this._buildingArea = [];
    this.http.get(this.buildingApiURL).pipe(take(1))
      .subscribe((buildingArea: any) => {
        if (Object.keys(buildingArea).length > 0) {
          for (const key in buildingArea) {
            if (buildingArea[key].title !== 'Unknown') {
              const value = buildingArea[key].value;
              const title = buildingArea[key].title;
              this._buildingArea.push({
                order: parseInt(value),
                title: title.replace(/\./g, ',').replace(/\btot\b/g, 'up to'),
                value
              })
            }
          }
        }
        this._buildingAreaLoading$.next(false);
      })
  }

  //Building Area
  getLandArea() {
    this._plotArea = [];
    this.http.get(this.plotApiURL).pipe(take(1))
      .subscribe((plotArea: any) => {
        if (Object.keys(plotArea).length > 0) {
          console.log(plotArea);
          for (const key in plotArea) {
            if (plotArea[key].title !== 'Unknown') {
              const value = plotArea[key].value;
              const title = plotArea[key].title;
              this._plotArea.push({
                order: parseInt(value),
                title: title.replace(/\./g, ',').replace(/\btot\b/g, 'up to'),
                value
                })
            }

          }
        }
        this._plotAreaLoading$.next(false);
      })

  }

  get plotArea$() {
    return this._plotArea$.asObservable();
  }

  get buildingArea$() {
    return this._buildingArea$.asObservable();
  }


  get buildingAreaLoading$() {
    return this._buildingAreaLoading$.asObservable();
  }

  get plotAreaLoading$() {
    return this._plotAreaLoading$.asObservable();
  }

  get plotArea() {
    return this._plotArea;
  }

  get buildingArea() {
    return this._buildingArea;
  }



}
