import { Component, input, OnInit } from '@angular/core';
import { Plot } from 'src/app/model/plot.model';
import { IonCard, IonCardContent, IonCardHeader, IonIcon, ModalController, IonChip } from '@ionic/angular/standalone';
import { CurrencyPipe } from '@angular/common';
import { DotToCommaPipe } from "../../pipes/dot-to-comma.pipe";
import { Router } from '@angular/router';
import { SecureUrlPipe } from "../../pipes/secure-url.pipe";
import { getDistanceInKm } from 'src/app/utils/distance';
import { MapService } from 'src/app/services/map.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-plot-view',
  templateUrl: './plot-view.component.html',
  styleUrls: ['./plot-view.component.scss'],
  imports: [IonChip, IonCard, IonCardContent, IonCardHeader, IonIcon, TranslateModule, DotToCommaPipe, SecureUrlPipe],
  standalone: true
})
export class PlotViewComponent implements OnInit {

  plot = input.required<Plot>();
  userLocation!: { lat: number; lng: number };
  distance = '';
  lat!:number;
  lng!:number;
  viewMode = input<string>();

  constructor(private currencyPipe: CurrencyPipe, private modalCtrl: ModalController,
    private mapService: MapService,
    private router: Router) { }

  ngOnInit() {
    const location = this.plot()['wpcf-kaart'];
    const regex = /{(-?[\d.]+),(-?[\d.]+)}/;
    const match = location.match(regex);
    console.log(this.plot());
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



    if (this.plot()['wpcf-prijs-zonder-punten']) {
      const price=this.plot()['wpcf-prijs-zonder-punten'];
      const transformedPrice = price.replace(/\./g, '');
      if (this.plot().isEuro) {
        this.plot().eur = this.currencyPipe.transform(transformedPrice, 'EUR', 'symbol', '1.0-2') as string
      } else if (this.plot().isUsd) {
        this.plot().usd = this.currencyPipe.transform(transformedPrice, 'USD', 'symbol', '1.0-2') as string
      } else {
        this.plot().srd = this.currencyPipe.transform(transformedPrice, 'SRD', 'symbol', '1.0-2') as string
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
      this.router.navigate(['/plots', this.plot().id])
    } catch (error) {
      this.router.navigate(['/plots', this.plot().id])
    }
  }


}
