import { CurrencyPipe } from '@angular/common';
import { Component, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon, IonCard, IonCardHeader, IonCardContent, IonButton, ModalController, IonChip } from '@ionic/angular/standalone';
import { HolidayHome } from 'src/app/model/holiday-home.model';
import { SecureUrlPipe } from "../../pipes/secure-url.pipe";
import { MapService } from 'src/app/services/map.service';
import { getDistanceInKm } from 'src/app/utils/distance';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-holiday-home-view',
  templateUrl: './holiday-home-view.component.html',
  styleUrls: ['./holiday-home-view.component.scss'],
  imports: [ IonIcon, IonCard, IonCardHeader, IonCardContent, IonButton, SecureUrlPipe,TranslateModule],
  standalone: true
})
export class HolidayHomeViewComponent implements OnInit {
  viewMode = input<string>();
  home = input.required<HolidayHome>();
  userLocation!: { lat: number; lng: number };
  distance = '';
lat!:number;
lng!:number;

  constructor(private currencyPipe: CurrencyPipe, private modalCtrl: ModalController,
    private mapService: MapService,
    private router: Router) { }

  ngOnInit() {
    const location = this.home()['wpcf-kaart'];
    const regex = /{(-?[\d.]+),(-?[\d.]+)}/;
    const match = location.match(regex);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      this.lat=lat;
      this.lng=lng;
    }
    if (this.mapService.address && Object.keys(this.mapService.address).length > 0 &&
      this.mapService.address.country_code === 'sr' &&
      this.mapService.address.lat && this.mapService.address.lng) {
      this.userLocation = {
        lat: this.mapService.address.lat,
        lng: this.mapService.address.lng
      }
        const distance = getDistanceInKm(this.lat, this.lng, this.userLocation.lat, this.userLocation.lng);
        console.log(distance);
        this.distance = distance;
      }



    if (this.home()['toolset-meta']['huurprijs-vakantiewoning']['huurprijs-per-week'].raw) {
      const price=this.home()['toolset-meta']['huurprijs-vakantiewoning']['huurprijs-per-week'].raw;
      const transformedPrice = price.replace(/\./g, '');

      if (this.home().isEuro) {
        this.home().eurPerWeek = this.currencyPipe.transform(transformedPrice, 'EUR', 'symbol', '1.0-2') as string
      } else if (this.home().isUsd) {
        this.home().usdPerWeek = this.currencyPipe.transform(transformedPrice, 'USD', 'symbol', '1.0-2') as string
      } else {
        this.home().srdPerWeek = this.currencyPipe.transform(transformedPrice, 'SRD', 'symbol', '1.0-2') as string
      }

    } if (this.home()['toolset-meta']['huurprijs-vakantiewoning']['huurprijs-per-dag'].raw) {
      const price=this.home()['toolset-meta']['huurprijs-vakantiewoning']['huurprijs-per-dag'].raw;
      const transformedPrice = price.replace(/\./g, '');

      if (this.home().isEuro) {
        this.home().eurPerDay = this.currencyPipe.transform(transformedPrice, 'EUR', 'symbol', '1.0-2') as string;
      } else if (this.home().isUsd) {
        this.home().usdPerDay = this.currencyPipe.transform(transformedPrice, 'USD', 'symbol', '1.0-2') as string;
      } else {
        this.home().srdPerDay = this.currencyPipe.transform(transformedPrice, 'SRD', 'symbol', '1.0-2') as string;
      }
    }
  }

  openGoogleMaps() {
    const url = `https://www.google.com/maps?q=${this.lat},${this.lng}`;
    window.open(url, '_blank');
  }


  async gotoDetails() {
    try {
      await this.modalCtrl.getTop();
      this.modalCtrl.dismiss();
      this.router.navigate(['/vacation-rentals', this.home().id]);

    } catch (error) {
      this.router.navigate(['/vacation-rentals', this.home().id]);

    }
  }

}
