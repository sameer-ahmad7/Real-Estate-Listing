import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, PopoverController, IonSegment,
  IonButtons, IonBackButton, IonButton, IonIcon, IonCard, IonSegmentButton,
  IonLabel, IonText, IonRow, IonGrid, IonCol, IonChip, IonPopover, IonModal
} from '@ionic/angular/standalone';
import { BusinessProperty, BusinessType } from 'src/app/model/business-property.model';
import { District } from 'src/app/model/districts.model';
import { HouseStatus } from 'src/app/model/home.model';
import { BusinessPropertyService } from 'src/app/services/business-property.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { ellipsisVertical, chevronBack } from 'ionicons/icons';
import { combineLatest, filter, Subject, Subscription, switchMap, take, takeUntil } from 'rxjs';
import { IFilter, DataTypes } from 'src/app/model/filter.model';
import { AgentService } from 'src/app/services/agent.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { DistrictService } from 'src/app/services/district.service';
import { HomeService } from 'src/app/services/home.service';
import { SwiperOptions } from 'swiper/types';
import { DotToCommaPipe } from "../../pipes/dot-to-comma.pipe";
import { BusinessPropertyViewComponent } from '../business-property-view/business-property-view.component';
import { ValutaOptions } from 'src/app/model/valuta-model';
import { ValutaService } from 'src/app/services/valuta.service';
import { Favorite, ListingType } from 'src/app/model/favorite.model';
import { FavoriteService } from 'src/app/services/favorite.service';
import { ToastService } from 'src/app/services/toast.service';
import { Share } from '@capacitor/share';
import { SecureUrlPipe } from "../../pipes/secure-url.pipe";
import { environment } from 'src/environments/environment';
import { FullscreenViewPage } from '../fullscreen-view/fullscreen-view.page';
import { MediaService } from 'src/app/services/media.service';
import { getDistanceInKm } from 'src/app/utils/distance';
import { MapService } from 'src/app/services/map.service';
import { CustomSpinnerPage } from '../custom-spinner/custom-spinner.page';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { PhoneContactComponent } from 'src/app/shared/phone-contact/phone-contact.component';

@Component({
  selector: 'app-business-property-details',
  templateUrl: './business-property-details.page.html',
  styleUrls: ['./business-property-details.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonChip, IonCol, IonGrid, IonRow, IonText, IonLabel, BusinessPropertyViewComponent, IonModal,
    FullscreenViewPage,RouterLink,TranslateModule,
    IonSegmentButton, IonCard, IonIcon, IonButton, IonBackButton, IonButtons, IonSegment, IonPopover,
    CustomSpinnerPage, IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, DotToCommaPipe, SecureUrlPipe]
})
export class BusinessPropertyDetailsPage implements OnInit,OnDestroy {
  favorites: Favorite[] = [];
  isFavorite = false;
  lat!: number;
  lng!: number;



  showFullContent = false;
  displayedContent = '';
  maxLength: number = 150;
  isLoading = true;
  isSimilarPropertiesLoading = true;
  businessTypes: BusinessType[] = [];
  business!: BusinessProperty;
  businessProperties: BusinessProperty[] = [];
  id = '';
  districts: District[] = [];
  selectedSegment = 'eur';
  mapBaseURL = 'https://maps.googleapis.com/maps/api/staticmap';
  mapURL = '';
  apiKey = environment.mapsKey;
  houseStatuses: HouseStatus[] = [];
  @ViewChild('slides', { static: false }) swiperElement: any;
  isRental = false;
  valutaOptions: ValutaOptions[] = [];
  isPreviousLoading=true;

  isFullViewOpen = false;
  galleryViewIndex = 0;
  galleryImages: string[] = [];

  userLocation!: { lat: number; lng: number };
  distance = '';

  language$!:Subscription;
  language='';
  private destroy$=new Subject<void>();

  constructor(private homeService: HomeService, private businessService: BusinessPropertyService, private districtService: DistrictService,
    private agentService: AgentService, private valutaService: ValutaService, private currencyPipe: CurrencyPipe, private favoriteService: FavoriteService,
    private toast: ToastService, private popoverCtrl: PopoverController, private mapService: MapService,private languageService: LanguageService,
    private currencyService: CurrencyService, private route: ActivatedRoute) {
    addIcons({ ellipsisVertical, chevronBack });

  }

  ngOnInit() {
        this.language$=this.languageService.language$
        .pipe(takeUntil(this.destroy$))
        .subscribe((lang)=>{
          this.language=lang;
        });

    this.route.url.
      pipe(take(1))
      .subscribe(segments => {
        const routePath = segments.map(segment => segment.path).join('/');
        if (routePath.includes('business-properties/rental')) {
          this.isRental = true;
        } else {
          this.isRental = false;
        }
      });
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

  dismissModal() {
    this.isFullViewOpen = false;
  }

  updateGalleryViewIndex(event: any) {
    this.galleryViewIndex = event.target.swiper.realIndex;

  }



  openFullView() {
    this.galleryImages = this.business.gallery_thumbnails.map(r => r.full);
    this.isFullViewOpen = true;
  }



  ngDoCheck() {
    // Detect change in `isLoading`
    if (this.isPreviousLoading !== this.isLoading && !this.isLoading) {
      this.isPreviousLoading = this.isLoading;
      setTimeout(() => {
        if (this.business.gallery_thumbnails.length > 0) {
          this.initializeSlides();
        }
      }, 1200); // Delay ensures DOM updates
    }
  }

  async share() {
    await Share.share({
      title: this.business.title.rendered,
      text: this.isRental ? this.business['toolset-meta']['details-huurpand'].subtitel.raw : this.business['toolset-meta']['details-kooppand'].subtitel.raw,
      url: this.business.link,
    });
  }


  async toggleFavorite(popover: IonPopover) {
    if (this.isFavorite) {
      await this.favoriteService.removeFavorite(this.id);
      this.favorites = await this.favoriteService.getFavorites();
      this.toast.show('Removed from favorites');
      this.isFavorite = false;
    } else {
      const favorite: Favorite = {
        id: this.id,
        type: this.isRental ? ListingType.RENTALBUSINESSPROPERTY : ListingType.BUSINESSPROPERTY
      }
      await this.favoriteService.addFavorite(favorite);
      this.toast.show('Added to favorites');
      this.isFavorite = true;
    }
    popover.dismiss();
  }

  openGoogleMaps() {
    const url = `https://www.google.com/maps?q=${this.lat},${this.lng}`;
    window.open(url, '_blank');
  }

  openEmail(email: string) {
    window.location.href = `mailto:${email}`;
  }

  async openPhoneNumber(phone: string,event:any) {
    const popover=await this.popoverCtrl.create({
      component:PhoneContactComponent,
      componentProps:{
        phone:phone
      },
      event:event,
      backdropDismiss:true,
      dismissOnSelect:true,
      reference:'trigger'
    });
    await popover.present();
    }




  fetchSimilarProperties() {
    const filter: IFilter = {
      excludeId: this.id,
      type: [DataTypes.BUSINESS_PROPERTY]
    }
    if (this.isRental) {
      this.businessService.onApplyRentalBusinessPropertyFilter(filter, this.districts, this.valutaOptions, 5)
        .pipe(take(1))
        .subscribe(properties => {
          this.businessProperties = properties;
          this.isSimilarPropertiesLoading = false;
        })

    } else {
      this.businessService.onApplyBuyBusinessPropertyFilter(filter, this.districts, this.valutaOptions, 5)
        .pipe(take(1))
        .subscribe(properties => {
          this.businessProperties = properties;
          this.isSimilarPropertiesLoading = false;
        })

    }
  }


  async fetchData() {
    this.favorites = await this.favoriteService.getFavorites();
    if (this.favorites.findIndex(f => f.id === this.id) >= 0) {
      this.isFavorite = true;
    }

    combineLatest([this.businessService.businessTypesLoading$, this.districtService.isLoading$, this.valutaService.isLoading$])
      .pipe(filter(([loading, districtLoading, valutaLoading]) => !loading && !districtLoading && !valutaLoading),
        take(1),
        switchMap(([_, __]) => {
          this.valutaOptions = this.valutaService.valueOptions;
          this.districts = this.districtService.districts;
          this.businessTypes = this.businessService.businessTypes;
          return combineLatest([this.businessService.getPropertyById(this.id, this.districts, this.valutaOptions, this.isRental ? true : false),

          this.isRental ? this.homeService.getRentalHouseStatus() : this.homeService.getHouseStatus(),
          this.isRental ? this.agentService.getMakeelarFromBusinessRentalListing(this.id) : this.agentService.getMakeelarFromBusinessListing(this.id)]);
        })
      )
      .subscribe(([property, houseStatuses, broker]) => {
        this.houseStatuses = houseStatuses;
        this.business = property;
        this.fetchSimilarProperties();
        this.business.broker = broker as any;
        // this.mapService.getMapImage(this.home['wpcf-kaart']);

        if (this.isRental) {
          const status = this.houseStatuses.find(s => s.value === this.business['wpcf-huurobject-status']);
          if (status) {
            this.business.status = status.title;
          }

        } else {
          const status = this.houseStatuses.find(s => s.value === this.business['wpcf-koopobject-status']);
          if (status) {
            this.business.status = status.title;
          }

        }

        if (this.mapService.address && Object.keys(this.mapService.address).length > 0 &&
          this.mapService.address.country_code === 'sr' && this.business['wpcf-kaart'] &&
          this.mapService.address.lat && this.mapService.address.lng) {
          this.userLocation = {
            lat: this.mapService.address.lat,
            lng: this.mapService.address.lng
          }
          const location = this.business['wpcf-kaart'];
          const regex = /{(-?[\d.]+),(-?[\d.]+)}/;
          const match = location.match(regex);
          if (match) {
            const lat = parseFloat(match[1]);
            const lng = parseFloat(match[2]);
            const distance = getDistanceInKm(lat, lng, this.userLocation.lat, this.userLocation.lng);
            console.log(distance);
            this.distance = distance;
          }

        }


        const businessType = this.businessTypes.find(h => h.value === this.business['wpcf-type-zakenpand']);
        if(this.language==='en'){
          this.displayedContent = this.business.content.rendered.slice(0, this.maxLength) + '<p class="read">Read more</p>';

        }else{
          this.displayedContent = this.business.content.rendered.slice(0, this.maxLength) + '<p class="read">Lees meer</p>';

        }

        if(this.business['wpcf-kaart'] ) {

        const location = this.business['wpcf-kaart'];
        const regex = /{(-?[\d.]+),(-?[\d.]+)}/;
        const match = location.match(regex);
        if (match) {
          this.lat = parseFloat(match[1]);
          this.lng = parseFloat(match[2]);
          this.mapURL = `${this.mapBaseURL}?center=${this.lat},${this.lng}&zoom=18&size=540x400&maptype=hybrid&markers=${this.lat},${this.lng}&key=${this.apiKey}`;
          // this.mapURL = `https://static-maps.yandex.ru/1.x/?lang=en-US&ll=${longitude},${latitude}&z=18&size=540,400&l=sat,skl&pt=${longitude},${latitude},pm2rdm`;
        }
      }
        if (businessType) {
          this.business.type = businessType.label;
        }
        if (this.business['wpcf-prijs-zonder-punten'] || this.business['wpcf-huurprijs-pm-zp']) {
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

  toggleContent() {
    this.showFullContent = !this.showFullContent;
    this.updateDisplayedContent();
  }

  updateDisplayedContent() {
    this.displayedContent = this.showFullContent ? this.business.content.rendered : this.business.content.rendered.slice(0, this.maxLength) + '<p class="read">Read more</p>';
  }

  fetchPrice() {
    if (this.isRental) {
      const price=this.business['wpcf-huurprijs-pm-zp'];
      const transformedPrice = price.replace(/\./g, '');
      if (this.business.isEuro) {
        combineLatest([this.currencyService.convertPrice(transformedPrice, 'usd'),
        this.currencyService.convertPrice(transformedPrice, 'srd')
        ]).pipe(take(1))
          .subscribe(([usd, srd]) => {
            this.business.eur = this.currencyPipe.transform(transformedPrice, 'EUR', 'symbol', '1.0-2') as string
            this.business.srd = this.currencyPipe.transform(srd.converted_price, 'SRD', 'symbol', '1.0-2') as string
            this.business.usd = this.currencyPipe.transform(usd.converted_price, 'USD', 'symbol', '1.0-2') as string
            this.isLoading = false;
            // setTimeout(() => {
            //   this.initializeSlides();
            // }, 800);

          },err=>{
            console.log('error',err);
            this.isLoading = false;
          })

      } else if (this.business.isUsd) {
        combineLatest([this.currencyService.convertPrice(transformedPrice, 'eur', 'usd'),
        this.currencyService.convertPrice(transformedPrice, 'srd', 'usd')
        ]).pipe(take(1))
          .subscribe(([eur, srd]) => {
            this.business.usd = this.currencyPipe.transform(transformedPrice, 'USD', 'symbol', '1.0-2') as string
            this.business.srd = this.currencyPipe.transform(srd.converted_price, 'SRD', 'symbol', '1.0-2') as string
            this.business.eur = this.currencyPipe.transform(eur.converted_price, 'EUR', 'symbol', '1.0-2') as string
            this.isLoading = false;
            // setTimeout(() => {
            //   this.initializeSlides();
            // }, 800);

          },err=>{
            console.log('error',err);
            this.isLoading = false;
          })

      } else {

        combineLatest([this.currencyService.convertPrice(transformedPrice, 'eur', 'srd'),
        this.currencyService.convertPrice(transformedPrice, 'usd', 'srd')
        ]).pipe(take(1))
          .subscribe(([eur, usd]) => {
            this.business.srd = this.currencyPipe.transform(transformedPrice, 'SRD', 'symbol', '1.0-2') as string
            this.business.eur = this.currencyPipe.transform(eur.converted_price, 'EUR', 'symbol', '1.0-2') as string
            this.business.usd = this.currencyPipe.transform(usd.converted_price, 'USD', 'symbol', '1.0-2') as string
            this.isLoading = false;
            // setTimeout(() => {
            //   this.initializeSlides();
            // }, 800);

          },err=>{
            console.log('error',err);
            this.isLoading = false;
          })

      }
    } else {
      const price=this.business['wpcf-prijs-zonder-punten'];
      const transformedPrice = price.replace(/\./g, '');
      if (this.business.isEuro) {
        combineLatest([this.currencyService.convertPrice(transformedPrice, 'usd'),
        this.currencyService.convertPrice(transformedPrice, 'srd')
        ]).pipe(take(1))
          .subscribe(([usd, srd]) => {
            this.business.eur = this.currencyPipe.transform(transformedPrice, 'EUR', 'symbol', '1.0-2') as string
            this.business.srd = this.currencyPipe.transform(srd.converted_price, 'SRD', 'symbol', '1.0-2') as string
            this.business.usd = this.currencyPipe.transform(usd.converted_price, 'USD', 'symbol', '1.0-2') as string
            this.isLoading = false;
            // setTimeout(() => {
            //   this.initializeSlides();
            // }, 800);

          },err=>{
            console.log('error',err);
            this.isLoading = false;
          })

      } else if (this.business.isUsd) {
        combineLatest([this.currencyService.convertPrice(transformedPrice, 'eur', 'usd'),
        this.currencyService.convertPrice(transformedPrice, 'srd', 'usd')
        ]).pipe(take(1))
          .subscribe(([eur, srd]) => {
            this.business.usd = this.currencyPipe.transform(transformedPrice, 'USD', 'symbol', '1.0-2') as string
            this.business.srd = this.currencyPipe.transform(srd.converted_price, 'SRD', 'symbol', '1.0-2') as string
            this.business.eur = this.currencyPipe.transform(eur.converted_price, 'EUR', 'symbol', '1.0-2') as string
            this.isLoading = false;
            // setTimeout(() => {
            //   this.initializeSlides();
            // }, 800);

          },err=>{
            console.log('error',err);
            this.isLoading = false;
          })

      } else {
        combineLatest([this.currencyService.convertPrice(transformedPrice, 'eur', 'srd'),
        this.currencyService.convertPrice(this.business['wpcf-prijs-zonder-punten'], 'usd', 'srd')
        ]).pipe(take(1))
          .subscribe(([eur, usd]) => {
            this.business.srd = this.currencyPipe.transform(transformedPrice, 'SRD', 'symbol', '1.0-2') as string
            this.business.eur = this.currencyPipe.transform(eur.converted_price, 'EUR', 'symbol', '1.0-2') as string
            this.business.usd = this.currencyPipe.transform(usd.converted_price, 'USD', 'symbol', '1.0-2') as string
            this.isLoading = false;
            // setTimeout(() => {
            //   this.initializeSlides();
            // }, 800);

          },err=>{
            console.log('error',err);
            this.isLoading = false;
          })

      }

    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
