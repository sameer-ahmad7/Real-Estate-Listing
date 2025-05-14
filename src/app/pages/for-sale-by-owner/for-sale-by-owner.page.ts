import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonChip, IonButtons, IonBackButton, IonCard, IonButton } from '@ionic/angular/standalone';
import { ListingType } from 'src/app/model/favorite.model';
import { addIcons } from 'ionicons';
import { chevronBack } from 'ionicons/icons';
import { HomesListingPage } from '../homes-listing/homes-listing.page';
import { PlotListingPage } from "../plot-listing/plot-listing.page";
import { BusinessPropertyListingPage } from "../business-property-listing/business-property-listing.page";
import { IonRefresherCustomEvent, RefresherEventDetail } from '@ionic/core';
import { TranslateModule } from '@ngx-translate/core';

interface Segment{
  title:string;listType:ListingType
}


@Component({
  selector: 'app-for-sale-by-owner',
  templateUrl: './for-sale-by-owner.page.html',
  styleUrls: ['./for-sale-by-owner.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButtons, IonChip, IonContent, IonHeader,
    HomesListingPage,TranslateModule,
    IonTitle, IonToolbar, CommonModule, FormsModule, PlotListingPage, BusinessPropertyListingPage]
})
export class ForSaleByOwnerPage implements OnInit {



    selectedSegment:Segment={title:'Properties for Sale',listType:ListingType.HOME};
    segmentOptions:Segment[]=[
      {title:'Properties for Sale',listType:ListingType.HOME},
      {title:'Plots',listType:ListingType.PLOT},
      {title:'Properties for Rent',listType:ListingType.RENTALHOME},
      {title:'Business Properties for Sale',listType:ListingType.BUSINESSPROPERTY},
      {title:'Business Properties for Rent',listType:ListingType.RENTALBUSINESSPROPERTY}
    ]

    get listingTypeEnum(){
     return ListingType;
    }

  constructor() {
    addIcons({chevronBack});
  }

  ngOnInit() {
  }

  onSelectSegment(segment:Segment){
    this.selectedSegment=segment;
  }


}
