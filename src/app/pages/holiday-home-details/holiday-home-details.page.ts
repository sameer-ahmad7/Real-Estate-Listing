import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonChip, IonModal,
  IonProgressBar, IonButtons, IonBackButton, IonPopover,PopoverController,
  IonButton, IonSegment, IonIcon, IonCard, IonSegmentButton, IonLabel, IonCol, IonRow, IonGrid
} from '@ionic/angular/standalone';
import { HolidayHomeViewComponent } from '../holiday-home-view/holiday-home-view.component';
import { HolidayHomeService } from 'src/app/services/holiday-home.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { ellipsisVertical, chevronBack } from 'ionicons/icons';
import { District } from 'src/app/model/districts.model';
import { HomeTypes, Home, HouseStatus } from 'src/app/model/home.model';
import { AgentService } from 'src/app/services/agent.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { DistrictService } from 'src/app/services/district.service';
import { HomeService } from 'src/app/services/home.service';
import { combineLatest, filter, Subject, Subscription, switchMap, take, takeUntil } from 'rxjs';
import { DataTypes, IFilter } from 'src/app/model/filter.model';
import { HolidayHome } from 'src/app/model/holiday-home.model';
import { SwiperOptions } from 'swiper/types';
import { ValutaOptions } from 'src/app/model/valuta-model';
import { ValutaService } from 'src/app/services/valuta.service';
import { Favorite, ListingType } from 'src/app/model/favorite.model';
import { FavoriteService } from 'src/app/services/favorite.service';
import { Share } from '@capacitor/share';
import { ToastService } from 'src/app/services/toast.service';
import { SecureUrlPipe } from "../../pipes/secure-url.pipe";
import { environment } from 'src/environments/environment';
import { FullscreenViewPage } from '../fullscreen-view/fullscreen-view.page';
import { RepeatableMedia } from 'src/app/model/media.model';
import { MediaService } from 'src/app/services/media.service';
import { MapService } from 'src/app/services/map.service';
import { getDistanceInKm } from 'src/app/utils/distance';
import { CustomSpinnerPage } from '../custom-spinner/custom-spinner.page';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { PhoneContactComponent } from 'src/app/shared/phone-contact/phone-contact.component';

@Component({
  selector: 'app-holiday-home-details',
  templateUrl: './holiday-home-details.page.html',
  styleUrls: ['./holiday-home-details.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonGrid, IonRow, IonCol, IonLabel, IonSegmentButton, IonSegment, IonCard, IonChip, IonPopover, FullscreenViewPage,
    IonModal,RouterLink,TranslateModule,
    IonIcon, IonButton, IonBackButton, IonButtons, CustomSpinnerPage, IonContent, IonHeader, HolidayHomeViewComponent,
    IonToolbar, CommonModule, FormsModule, SecureUrlPipe]

})
export class HolidayHomeDetailsPage implements OnInit,OnDestroy {


  valutaOptions: ValutaOptions[] = [];

  favorites: Favorite[] = [];
  isFavorite = false;
  lat!: number;
  lng!: number;



  showFullContent = false;
  displayedContent = '';
  maxLength: number = 150;
  isLoading = true;
  isSimilarHomesLoading = true;
  homeTypes: HomeTypes[] = [];
  home!: HolidayHome;
  homes: HolidayHome[] = [];
  id = '';
  districts: District[] = [];
  selectedSegment = 'eur';
  mapBaseURL = 'https://maps.googleapis.com/maps/api/staticmap';
  mapURL = '';
  apiKey = environment.mapsKey;
  houseStatuses: HouseStatus[] = [];
  @ViewChild('slides', { static: false }) swiperElement: any;
  isRental = false;
  isPreviousLoading = true;
  isFullViewOpen = false;
  galleryViewIndex = 0;
  galleryImages: string[] = [];
  userLocation!: { lat: number; lng: number };
  distance = '';
  language$!:Subscription;
  language='';
  private destroy$=new Subject<void>();


  constructor(private homeService: HomeService, private districtService: DistrictService, private currencyPipe: CurrencyPipe,
    private agentService: AgentService, private holidayHomeService: HolidayHomeService, private valutaService: ValutaService,
    private favoriteService: FavoriteService, private toast: ToastService, private languageService: LanguageService, private mapService: MapService,
    private currencyService: CurrencyService, private route: ActivatedRoute,private popoverCtrl:PopoverController

  ) {
    addIcons({ ellipsisVertical, chevronBack });

  }

  ngOnInit() {

            this.language$=this.languageService.language$
            .pipe(takeUntil(this.destroy$))
            .subscribe((lang)=>{
              this.language=lang;
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
    this.galleryImages = this.home.gallery_thumbnails.map(r => r.full);
    this.isFullViewOpen = true;
  }



  ngDoCheck() {
    // Detect change in `isLoading`
    if (this.isPreviousLoading !== this.isLoading && !this.isLoading) {
      this.isPreviousLoading = this.isLoading;
      setTimeout(() => {
        if (this.home.gallery_thumbnails.length > 0) {
          this.initializeSlides();
        }
      }, 1200); // Delay ensures DOM updates
    }
  }



  async share() {
    await Share.share({
      title: this.home.title.rendered,
      text: this.home['toolset-meta']['details-vakantiewoning'].subtitel.raw,
      url: this.home.link,
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
        type: ListingType.VACATIONRENTALS
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




  fetchSimilarHomes() {
    const filter: IFilter = {
      excludeId: this.id,
      type: [DataTypes.HOLIDAY_HOME]
    }
    this.holidayHomeService.onApplyFilter(filter, this.districts, this.valutaOptions, 5)
      .pipe(take(1))
      .subscribe(homes => {
        this.homes = homes;
        this.isSimilarHomesLoading = false;
      })
  }

  fetchData() {
    combineLatest([this.homeService.homeTypesLoading$, this.districtService.isLoading$, this.valutaService.isLoading$])
      .pipe(filter(([loading, districtLoading, valutaLoading]) => !loading && !districtLoading && !valutaLoading),
        take(1),
        switchMap(_ => {
          this.valutaOptions = this.valutaService.valueOptions;
          this.districts = this.districtService.districts;
          this.homeTypes = this.homeService.homeTypes;
          return combineLatest([this.holidayHomeService.getHomeById(this.id, this.districts, this.valutaOptions),
          this.homeService.getRentalHouseStatus(),
          this.agentService.getMakeelarFromVacationListing(this.id)])
        })
      )
      .subscribe(([home, houseStatuses, broker]) => {
        this.houseStatuses = houseStatuses;
        this.home = home;
        this.fetchSimilarHomes();
        this.home.broker = broker as any;
        // this.mapService.getMapImage(this.home['wpcf-kaart']);

        const status = this.houseStatuses.find(s => s.value === this.home['wpcf-huurobject-status']);
        if (status) {
          this.home.status = status.title;
        }

        const homeType = this.homeTypes.find(h => h.value === this.home['wpcf-type-woning']);

        if (this.mapService.address && Object.keys(this.mapService.address).length > 0 &&
          this.mapService.address.country_code === 'sr' && home['wpcf-kaart'] &&
          this.mapService.address.lat && this.mapService.address.lng) {
          this.userLocation = {
            lat: this.mapService.address.lat,
            lng: this.mapService.address.lng
          }
          const location = this.home['wpcf-kaart'];
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


        if(this.language==='en'){
          this.displayedContent = this.home.content.rendered.slice(0, this.maxLength) + '<p class="read">Read more</p>';

        }else{
          this.displayedContent = this.home.content.rendered.slice(0, this.maxLength) + '<p class="read">Lees meer</p>';

        }
        if(this.home['wpcf-kaart']){
        const location = this.home['wpcf-kaart'];
        const regex = /{(-?[\d.]+),(-?[\d.]+)}/;
        const match = location.match(regex);
        if (match) {
          this.lat = parseFloat(match[1]);
          this.lng = parseFloat(match[2]);
          this.mapURL = `${this.mapBaseURL}?center=${this.lat},${this.lng}&zoom=18&size=540x400&maptype=hybrid&markers=${this.lat},${this.lng}&key=${this.apiKey}`;
          // this.mapURL = `https://static-maps.yandex.ru/1.x/?lang=en-US&ll=${longitude},${latitude}&z=18&size=540,400&l=sat,skl&pt=${longitude},${latitude},pm2rdm`;
        }
      }
        if (homeType) {
          this.home.type = homeType.title;
        }
        if (this.home['toolset-meta']['huurprijs-vakantiewoning']['huurprijs-per-week'] || this.home['toolset-meta']['huurprijs-vakantiewoning']['huurprijs-per-dag']) {
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

  fetchPrice() {
    this.isLoading = false;
    if (this.home['toolset-meta']['huurprijs-vakantiewoning']['huurprijs-per-week'].raw || this.home['toolset-meta']['huurprijs-vakantiewoning']['huurprijs-per-dag'].raw) {
      if (this.home.isEuro) {
        if (this.home['toolset-meta']['huurprijs-vakantiewoning']['huurprijs-per-week'].raw) {
          const price=this.home['toolset-meta']['huurprijs-vakantiewoning']['huurprijs-per-week'].raw;
          const transformedPrice = price.replace(/\./g, '');
          this.home.eurPerWeek = this.currencyPipe.transform(transformedPrice, 'EUR', 'symbol', '1.0-2') as string;
          combineLatest([this.currencyService.convertPrice(transformedPrice, 'usd'),
          this.currencyService.convertPrice(transformedPrice, 'srd')])
            .pipe(take(1))
            .subscribe(([usdPerWeek, srdPerWeek]) => {
              this.home.usdPerWeek = usdPerWeek.converted_price;
              this.home.srdPerWeek = srdPerWeek.converted_price;
            })

        }

        if (this.home['toolset-meta']['huurprijs-vakantiewoning']['huurprijs-per-dag'].raw) {
          const price=this.home['toolset-meta']['huurprijs-vakantiewoning']['huurprijs-per-dag'].raw;
          const transformedPrice = price.replace(/\./g, '');

          this.home.eurPerDay = this.currencyPipe.transform(transformedPrice, 'EUR', 'symbol', '1.0-2') as string;
          combineLatest([this.currencyService.convertPrice(transformedPrice, 'usd'),
          this.currencyService.convertPrice(transformedPrice, 'srd')])
            .pipe(take(1))
            .subscribe(([usdPerDay, srdPerDay]) => {
              this.home.usdPerDay = usdPerDay.converted_price;
              this.home.srdPerDay = srdPerDay.converted_price;
            })

        }


      }


      else if (this.home.isUsd) {
        if (this.home['toolset-meta']['huurprijs-vakantiewoning']['huurprijs-per-week'].raw) {
          const price=this.home['toolset-meta']['huurprijs-vakantiewoning']['huurprijs-per-week'].raw;
          const transformedPrice = price.replace(/\./g, '');
          this.home.usdPerWeek = this.currencyPipe.transform(transformedPrice, 'USD', 'symbol', '1.0-2') as string;
          combineLatest([this.currencyService.convertPrice(transformedPrice, 'eur'),
          this.currencyService.convertPrice(transformedPrice, 'srd')])
            .pipe(take(1))
            .subscribe(([eurPerWeek, srdPerWeek]) => {
              this.home.eurPerWeek = eurPerWeek.converted_price;
              this.home.srdPerWeek = srdPerWeek.converted_price;
            })

        }

        if (this.home['toolset-meta']['huurprijs-vakantiewoning']['huurprijs-per-dag'].raw) {
          const price=this.home['toolset-meta']['huurprijs-vakantiewoning']['huurprijs-per-dag'].raw;
          const transformedPrice = price.replace(/\./g, '');
          this.home.usdPerDay = this.currencyPipe.transform(transformedPrice, 'USD', 'symbol', '1.0-2') as string;
          combineLatest([this.currencyService.convertPrice(transformedPrice, 'eur'),
          this.currencyService.convertPrice(transformedPrice, 'srd')])
            .pipe(take(1))
            .subscribe(([eurPerDay, srdPerDay]) => {
              this.home.eurPerDay = eurPerDay.converted_price;
              this.home.srdPerDay = srdPerDay.converted_price;
            })

        }



      }
      else if (this.home.isSrd) {
        if (this.home['toolset-meta']['huurprijs-vakantiewoning']['huurprijs-per-week'].raw) {
          const price=this.home['toolset-meta']['huurprijs-vakantiewoning']['huurprijs-per-week'].raw;
          const transformedPrice = price.replace(/\./g, '');
          this.home.srdPerWeek = this.currencyPipe.transform(transformedPrice, 'SRD', 'symbol', '1.0-2') as string;
          combineLatest([this.currencyService.convertPrice(transformedPrice, 'usd'),
          this.currencyService.convertPrice(transformedPrice, 'eur')])
            .pipe(take(1))
            .subscribe(([usdPerWeek, eurPerWeek]) => {
              this.home.usdPerWeek = usdPerWeek.converted_price;
              this.home.eurPerWeek = eurPerWeek.converted_price;
            })

        }

        if (this.home['toolset-meta']['huurprijs-vakantiewoning']['huurprijs-per-week'].raw) {
          const price=this.home['toolset-meta']['huurprijs-vakantiewoning']['huurprijs-per-dag'].raw;
          const transformedPrice = price.replace(/\./g, '');
          this.home.srdPerDay = this.currencyPipe.transform(transformedPrice, 'SRD', 'symbol', '1.0-2') as string;
          combineLatest([this.currencyService.convertPrice(transformedPrice, 'usd'),
          this.currencyService.convertPrice(transformedPrice, 'eur')])
            .pipe(take(1))
            .subscribe(([usdPerDay, eurPerDay]) => {
              this.home.usdPerDay = usdPerDay.converted_price;
              this.home.eurPerDay = eurPerDay.converted_price;
            })

        }

      }
      // setTimeout(() => {
      //   this.initializeSlides();
      // }, 1200);

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
      zoom: {
        minRatio: 1,
        maxRatio: 5
      },
      navigation: false, // Disables arrows
      virtual: true
    }
    // const swiperInstance = new Swiper(this.swiperElement.nativeElement, swiperParams);
    Object.assign(this.swiperElement.nativeElement, swiperOptions);
    this.swiperElement.nativeElement.initialize();
    setTimeout(() => {
      this.swiperElement.nativeElement.swiper.zoom.enable();
    }, 200);
  }

  toggleContent() {
    this.showFullContent = !this.showFullContent;
    this.updateDisplayedContent();
  }

  updateDisplayedContent() {
    this.displayedContent = this.showFullContent ? this.home.content.rendered : this.home.content.rendered.slice(0, this.maxLength) + '<p class="read">Read more</p>';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
      }

}
