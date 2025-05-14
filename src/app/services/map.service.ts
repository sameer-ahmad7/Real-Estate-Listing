import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddressInfo, GeocodeLocation } from '../model/location.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private apiURL = `https://nominatim.openstreetmap.org/reverse?format=json`

  private _address: AddressInfo | null = null;

  private _address$=new Subject<AddressInfo>();

  private _isLoading$ = new BehaviorSubject<boolean>(true);

  constructor(private http: HttpClient) { }

  async getLocation() {

    if(this.getCachedLocation()){
      const address=this.getCachedLocation();
      this._isLoading$.next(false);
      this._address=address;
      this.updateLocationInBackground();
    }else{
      if (Capacitor.isNativePlatform()) {
        try {
          const res = await Geolocation.getCurrentPosition();
          if (res) {
            const lat = res.coords.latitude;
            const lng = res.coords.longitude;
            const params = new HttpParams().set('lat', lat).set('lon', lng);
            this.http.get<GeocodeLocation>(this.apiURL, { params }).subscribe(address => {
              if (address.address) {
                this._address = address.address;
                this._address.lat = lat;
                this._address.lng = lng;
                this.storeCachedLocation(this._address);
              }
              this._isLoading$.next(false);
            });
          } else {
            this._isLoading$.next(false);
          }
        } catch (err) {
          this._isLoading$.next(false);
        }

      } else {
        this._isLoading$.next(false);
      }

    }

 }

 updateLocationInBackground(){
Geolocation.getCurrentPosition({enableHighAccuracy:true}).then(res=>{
  const lat = res.coords.latitude;
  const lng = res.coords.longitude;
  const params = new HttpParams().set('lat', lat).set('lon', lng);
  this.http.get<GeocodeLocation>(this.apiURL, { params }).subscribe(address => {
    if (address.address) {
      this._address = address.address;
      this._address.lat = lat;
      this._address.lng = lng;
      this.storeCachedLocation(this._address);
      this._address$.next(this._address);
    }

  })
 });
}

 storeCachedLocation(address:AddressInfo){
  localStorage.setItem('location',JSON.stringify(address));
 }

  getCachedLocation():AddressInfo|null{
    const location=localStorage.getItem('location');
    if(location){
      return JSON.parse(location) as AddressInfo;
    }
    return null;
  }

  get address() {
    return { ...this._address };
  }

  get address$(){
    return this._address$.asObservable();
  }

  get isLoading$() {
    return this._isLoading$.asObservable();
  }

}
