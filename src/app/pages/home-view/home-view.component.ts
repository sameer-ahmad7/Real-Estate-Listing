import { IonCard, IonCardHeader, IonButton, IonCardContent, IonIcon, ModalController, IonChip } from '@ionic/angular/standalone';
import { Component, input, OnInit } from '@angular/core';
import { Home } from 'src/app/model/home.model';
import { DotToCommaPipe } from "../../pipes/dot-to-comma.pipe";
import { CurrencyPipe } from "@angular/common";
import { Router, RouterLink } from '@angular/router';
import { SecureUrlPipe } from "../../pipes/secure-url.pipe";
import { MapService } from 'src/app/services/map.service';
import { getDistanceInKm } from 'src/app/utils/distance';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrls: ['./home-view.component.scss'],
  imports: [IonChip, IonCard, IonCardHeader, IonCardContent, IonIcon,
    TranslateModule,
    CurrencyPipe, DotToCommaPipe, SecureUrlPipe],
  standalone: true
})
export class HomeViewComponent implements OnInit {

  viewMode = input<string>();
  home = input.required<Home>();
  isRental = input<boolean>();
  userLocation!: { lat: number; lng: number };
  distance = '';
  lat!:number;
  lng!:number;

  constructor(private currencyPipe: CurrencyPipe, private router: Router,
    private mapService: MapService,
    private modalCtrl: ModalController) { }

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


    if (this.home()['wpcf-prijs-zonder-punten']) {
      const price=this.home()['wpcf-prijs-zonder-punten'];
      const transformedPrice = price.replace(/\./g, '');
      if (this.home().isEuro) {
        this.home().eur = this.currencyPipe.transform(transformedPrice, 'EUR', 'symbol', '1.0-2') as string
      } else if (this.home().isUsd) {
        this.home().usd = this.currencyPipe.transform(transformedPrice, 'USD', 'symbol', '1.0-2') as string
      } else {
        this.home().srd = this.currencyPipe.transform(transformedPrice, 'SRD', 'symbol', '1.0-2') as string
      }
    } else if (this.home()['wpcf-huurprijs-pm-zp']) {
      const price=this.home()['wpcf-huurprijs-pm-zp'];
      const transformedPrice = price.replace(/\./g, '');
      if (this.home().isEuro) {
        this.home().eur = this.currencyPipe.transform(transformedPrice, 'EUR', 'symbol', '1.0-2') as string
      } else if (this.home().isUsd) {
        this.home().usd = this.currencyPipe.transform(transformedPrice, 'USD', 'symbol', '1.0-2') as string
      } else {
        this.home().srd = this.currencyPipe.transform(transformedPrice, 'SRD', 'symbol', '1.0-2') as string
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
      this.router.navigate(['/houses', this.isRental() ? 'rental' : 'purchase', this.home().id]);

    } catch (error) {
      this.router.navigate(['/houses', this.isRental() ? 'rental' : 'purchase', this.home().id]);

    }
  }

}
