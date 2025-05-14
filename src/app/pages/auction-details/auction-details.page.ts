import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonProgressBar, IonButtons, IonBackButton, IonPopover, IonButton, IonList, IonItem, IonModal, IonCard, IonSegmentButton, IonLabel, IonGrid, IonRow, IonCol, IonChip } from '@ionic/angular/standalone';
import { AuctionProperty } from 'src/app/model/auction.model';
import { environment } from 'src/environments/environment';
import { AuctionService } from 'src/app/services/auction.service';
import { MediaService } from 'src/app/services/media.service';
import { ActivatedRoute } from '@angular/router';
import { Share } from '@capacitor/share';
import { addIcons } from 'ionicons';
import { ellipsisVertical, chevronBack } from 'ionicons/icons';
import { take, combineLatest, filter, switchMap } from 'rxjs';
import { District } from 'src/app/model/districts.model';
import { Favorite, ListingType } from 'src/app/model/favorite.model';
import { IFilter, DataTypes } from 'src/app/model/filter.model';
import { HouseStatus } from 'src/app/model/home.model';
import { RepeatableMedia } from 'src/app/model/media.model';
import { ValutaOptions } from 'src/app/model/valuta-model';
import { CurrencyService } from 'src/app/services/currency.service';
import { DistrictService } from 'src/app/services/district.service';
import { HomeService } from 'src/app/services/home.service';
import { ValutaService } from 'src/app/services/valuta.service';
import { SwiperOptions } from 'swiper/types';
import { SecureUrlPipe } from "../../pipes/secure-url.pipe";
import { FullscreenViewPage } from "../fullscreen-view/fullscreen-view.page";
import { DotToCommaPipe } from "../../pipes/dot-to-comma.pipe";
import { CustomSpinnerPage } from '../custom-spinner/custom-spinner.page';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.page.html',
  styleUrls: ['./auction-details.page.scss'],
  standalone: true,
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonChip, IonCol, IonRow, IonGrid, IonLabel, IonSegmentButton, TranslateModule,
    IonCard, IonModal, IonItem, IonList, IonButton, IonPopover, IonBackButton, IonButtons, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, SecureUrlPipe,
    CustomSpinnerPage,
    FullscreenViewPage, DotToCommaPipe]
})
export class AuctionDetailsPage implements OnInit {

  isFavorite = false;
  lat!: number;
  lng!: number;



showFullContent = false;
displayedContent = '';
maxLength: number = 150;
isLoading = true;
isSimilarPropertiesLoading = true;
property!: AuctionProperty;
auctionProperties: AuctionProperty[] = [];
id = '';
districts: District[] = [];
selectedSegment = 'eur';
mapBaseURL = 'https://maps.googleapis.com/maps/api/staticmap';
mapURL='';
apiKey=environment.mapsKey;
houseStatuses: HouseStatus[] = [];
@ViewChild('slides', { static: false }) swiperElement: any;
isRental = false;
valutaOptions:ValutaOptions[]=[];

  repeatableMedias: RepeatableMedia[] = [];
  isRepeatableMediaLoading = false;

  isPreviousRepeatableMediaLoading = true;
  isPreviousLoading = true;
  isFullViewOpen = false;
  galleryViewIndex = 0;
  galleryImages: string[] = [];



constructor(private homeService: HomeService, private auctionService: AuctionService, private districtService: DistrictService,
  private valutaService:ValutaService,private currencyPipe:CurrencyPipe,
  private mediaService:MediaService,
  private currencyService: CurrencyService, private route: ActivatedRoute) {
  addIcons({ ellipsisVertical, chevronBack });

}

ngOnInit() {
  this.route.paramMap
    .pipe(take(1))
    .subscribe(param => {
      const id = param.get('id');
      if (id) {
        this.id = id;
        this.fetchData();
      }
    })
}

ngDoCheck() {
  // Detect change in `isLoading`
  if (this.isPreviousLoading !== this.isLoading && !this.isLoading) {
    this.isPreviousLoading = this.isLoading;

    if (this.isPreviousRepeatableMediaLoading !== this.isRepeatableMediaLoading && !this.isPreviousLoading) {
      this.isPreviousLoading = this.isRepeatableMediaLoading;
      setTimeout(() => {
        if(this.repeatableMedias.length>0){
          this.initializeSlides();
        }
      }, 1200); // Delay ensures DOM updates
    }

  }
}


initializeSlides() {
  const swiperOptions: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 10, // Adjust spacing between slides
    pagination: {
      clickable: true,
      type: 'bullets', // Dots for pagination
      dynamicBullets: true, // For limited number of bullets
    },
    navigation: false, // Disables arrows
    virtual: true
  }
  // const swiperInstance = new Swiper(this.swiperElement.nativeElement, swiperParams);
  Object.assign(this.swiperElement.nativeElement, swiperOptions);
  this.swiperElement.nativeElement.initialize();
}



dismissModal() {
  this.isFullViewOpen = false;
}

updateGalleryViewIndex(event: any) {
  this.galleryViewIndex = event.target.swiper.realIndex;

}


fetchRepeatableMedias() {
  if (this.property['toolset-meta']['object-media']['object-gallerij'].repeatable.length > 1) {
    const repeatableIds = this.property['toolset-meta']['object-media']['object-gallerij'].repeatable.map(r => r.attachment_id);
    this.mediaService.getThumbnailImages(repeatableIds).subscribe(repeatableMedia => {
      this.repeatableMedias = repeatableMedia;
      this.isRepeatableMediaLoading = false;
    })
  } else {
    this.isRepeatableMediaLoading = false;
  }
}

openFullView() {
  this.galleryImages = this.repeatableMedias.map(r => r.fullImage);
  this.isFullViewOpen = true;
}



async share() {
  await Share.share({
    title: this.property.title.rendered,
    text: this.isRental ? this.property['toolset-meta']['details-veiling'].subtitel.raw : this.property['toolset-meta']['details-veiling'].subtitel.raw,
    url: this.property.link,
  });
}


  openGoogleMaps() {
    const url = `https://www.google.com/maps?q=${this.lat},${this.lng}`;
    window.open(url, '_blank');
  }

  openEmail(email: string) {
    window.location.href = `mailto:${email}`;
  }

  openPhoneNumber(phone: string) {
    window.location.href = `tel:${phone}`;
  }





async fetchData() {

  combineLatest([this.districtService.isLoading$,this.valutaService.isLoading$])
    .pipe(filter(([loading, valutaLoading]) => !loading &&  !valutaLoading),
      take(1),
      switchMap(([_, __]) => {
        this.valutaOptions=this.valutaService.valueOptions;
        this.districts = this.districtService.districts;
        return combineLatest(([this.auctionService.getAuctionById(this.id, this.districts,this.valutaOptions),
         this.homeService.getHouseStatus()]))
      })
    )
    .subscribe(([property, houseStatuses]) => {
      this.houseStatuses = houseStatuses;
      this.property = property;
      this.fetchRepeatableMedias();

        const status = this.houseStatuses.find(s => s.value === this.property['wpcf-koopobject-status']);
        if (status) {
          this.property.status = status.title;
        }


      this.displayedContent = this.property.content.rendered.slice(0, this.maxLength) + '<p class="read">Read more</p>';
      const location = this.property['wpcf-kaart'];
      const regex = /{(-?[\d.]+),(-?[\d.]+)}/;
      const match = location.match(regex);
      if (match) {
        this.lat=parseFloat(match[1]);
        this.lng=parseFloat(match[2]);
        this.mapURL = `${this.mapBaseURL}?center=${this.lat},${this.lng}&zoom=18&size=540x400&maptype=hybrid&markers=${this.lat},${this.lng}&key=${this.apiKey}`;
        // this.mapURL = `https://static-maps.yandex.ru/1.x/?lang=en-US&ll=${longitude},${latitude}&z=18&size=540,400&l=sat,skl&pt=${longitude},${latitude},pm2rdm`;
      }
      if (this.property['wpcf-prijs-zonder-punten'] || this.property['wpcf-huurprijs-pm-zp']) {
        this.fetchPrice();
      }
      else {
        this.isLoading = false;
        // setTimeout(() => {
        //   this.initializeSlides();
        // }, 800);

      }
    });
}


toggleContent() {
  this.showFullContent = !this.showFullContent;
  this.updateDisplayedContent();
}

updateDisplayedContent() {
  this.displayedContent = this.showFullContent ? this.property.content.rendered : this.property.content.rendered.slice(0, this.maxLength) + '<p class="read">Read more</p>';
}

fetchPrice() {

    if(this.property.isEuro){
      combineLatest([this.currencyService.convertPrice(this.property['wpcf-prijs-zonder-punten'], 'usd'),
      this.currencyService.convertPrice(this.property['wpcf-prijs-zonder-punten'], 'srd')
      ]).pipe(take(1))
        .subscribe(([usd, srd]) => {
          this.property.eur=this.currencyPipe.transform(this.property['wpcf-prijs-zonder-punten'],'EUR','symbol','1.0-2') as string
          this.property.srd = this.currencyPipe.transform(srd.converted_price,'SRD','symbol','1.0-2') as string
          this.property.usd = this.currencyPipe.transform(usd.converted_price,'EUR','symbol','1.0-2') as string
          this.isLoading = false;
          // setTimeout(() => {
          //   this.initializeSlides();
          // }, 800);

        })

    }else if(this.property.isUsd){
      combineLatest([this.currencyService.convertPrice(this.property['wpcf-prijs-zonder-punten'], 'eur','usd'),
      this.currencyService.convertPrice(this.property['wpcf-prijs-zonder-punten'], 'srd','usd')
      ]).pipe(take(1))
        .subscribe(([eur, srd]) => {
          this.property.usd=this.currencyPipe.transform(this.property['wpcf-prijs-zonder-punten'],'USD','symbol','1.0-2') as string
          this.property.srd = this.currencyPipe.transform(srd.converted_price,'SRD','symbol','1.0-2') as string
          this.property.eur = this.currencyPipe.transform(eur.converted_price,'EUR','symbol','1.0-2') as string
          this.isLoading = false;
          // setTimeout(() => {
          //   this.initializeSlides();
          // }, 800);

        })

    }else{
      combineLatest([this.currencyService.convertPrice(this.property['wpcf-prijs-zonder-punten'], 'eur','srd'),
      this.currencyService.convertPrice(this.property['wpcf-prijs-zonder-punten'], 'usd','srd')
      ]).pipe(take(1))
        .subscribe(([eur, usd]) => {
          this.property.srd=this.currencyPipe.transform(this.property['wpcf-prijs-zonder-punten'],'SRD','symbol','1.0-2') as string
          this.property.eur = this.currencyPipe.transform(eur.converted_price,'EUR','symbol','1.0-2') as string
          this.property.usd = this.currencyPipe.transform(usd.converted_price,'USD','symbol','1.0-2') as string
          this.isLoading = false;
          // setTimeout(() => {
          //   this.initializeSlides();
          // }, 800);

        })
  }
}
}
