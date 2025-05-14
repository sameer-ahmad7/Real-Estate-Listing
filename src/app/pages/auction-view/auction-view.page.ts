import { Component, input, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController, IonCard, IonCardHeader, IonButton, IonCardContent, IonIcon } from '@ionic/angular/standalone';
import { Home } from 'src/app/model/home.model';
import { Router } from '@angular/router';
import { DotToCommaPipe } from "../../pipes/dot-to-comma.pipe";
import { SecureUrlPipe } from "../../pipes/secure-url.pipe";
import { AuctionProperty } from 'src/app/model/auction.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-auction-view',
  templateUrl: './auction-view.page.html',
  styleUrls: ['./auction-view.page.scss'],
  standalone: true,
  imports: [IonIcon, IonCardContent, IonButton, IonCardHeader, IonCard, CommonModule,TranslateModule,
     FormsModule, DotToCommaPipe, SecureUrlPipe]
})
export class AuctionViewPage implements OnInit {
  property = input.required<AuctionProperty>();

  constructor(private currencyPipe:CurrencyPipe,private router:Router,private modalCtrl:ModalController) { }

  ngOnInit() {
    if(this.property()['wpcf-prijs-zonder-punten']){
      if(this.property().isEuro){
        this.property().eur=this.currencyPipe.transform(this.property()['wpcf-prijs-zonder-punten'],'EUR','symbol','1.0-2') as string
      }else if(this.property().isUsd){
        this.property().usd=this.currencyPipe.transform(this.property()['wpcf-prijs-zonder-punten'],'USD','symbol','1.0-2') as string
      }else{
        this.property().srd=this.currencyPipe.transform(this.property()['wpcf-prijs-zonder-punten'],'SRD','symbol','1.0-2') as string
      }
    }else if(this.property()['wpcf-huurprijs-pm-zp']){
      if(this.property().isEuro){
        this.property().eur=this.currencyPipe.transform(this.property()['wpcf-huurprijs-pm-zp'],'EUR','symbol','1.0-2') as string
      }else if(this.property().isUsd){
        this.property().usd=this.currencyPipe.transform(this.property()['wpcf-huurprijs-pm-zp'],'USD','symbol','1.0-2') as string
      }else{
        this.property().srd=this.currencyPipe.transform(this.property()['wpcf-huurprijs-pm-zp'],'SRD','symbol','1.0-2') as string
      }

    }
  }

 async gotoDetails(){
  try {
    await this.modalCtrl.getTop();
    this.modalCtrl.dismiss();
    this.router.navigate(['/auctions',this.property().id]);
  }catch {
    this.router.navigate(['/auctions',this.property().id]);
  }
}
}
