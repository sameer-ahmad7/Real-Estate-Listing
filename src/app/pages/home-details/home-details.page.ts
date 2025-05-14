import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonChip, IonModal,
  PopoverController, IonButtons, IonBackButton, IonPopover,
  IonButton, IonSegment, IonIcon, IonCard, IonSegmentButton, IonLabel, IonCol, IonRow, IonGrid
} from '@ionic/angular/standalone';
import { HomeService } from 'src/app/services/home.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { Home, HomeTypes, HouseStatus } from 'src/app/model/home.model';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, filter, of, Subject, Subscription, switchMap, take, takeUntil } from 'rxjs';
import { addIcons } from 'ionicons';
import { chevronBack, ellipsisVertical } from 'ionicons/icons';
import { DistrictService } from 'src/app/services/district.service';
import { District } from 'src/app/model/districts.model';
import { DotToCommaPipe } from "../../pipes/dot-to-comma.pipe";
import { SwiperOptions } from 'swiper/types';
import { MapService } from 'src/app/services/map.service';
import { AgentService } from 'src/app/services/agent.service';
import { DataTypes, IFilter } from 'src/app/model/filter.model';
import { HomeViewComponent } from '../home-view/home-view.component';
import { ValutaOptions } from 'src/app/model/valuta-model';
import { ValutaService } from 'src/app/services/valuta.service';
import { Favorite, ListingType } from 'src/app/model/favorite.model';
import { FavoriteService } from 'src/app/services/favorite.service';
import { Share } from '@capacitor/share';
import { ToastService } from 'src/app/services/toast.service';
import { SecureUrlPipe } from "../../pipes/secure-url.pipe";
import { environment } from 'src/environments/environment';
import { Capacitor } from '@capacitor/core';
import { RepeatableMedia } from 'src/app/model/media.model';
import { MediaService } from 'src/app/services/media.service';
import { FullscreenViewPage } from "../fullscreen-view/fullscreen-view.page";
import { getDistanceInKm } from 'src/app/utils/distance';
import { CustomSpinnerPage } from '../custom-spinner/custom-spinner.page';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { PhoneContactComponent } from 'src/app/shared/phone-contact/phone-contact.component';
@Component({
  selector: 'app-home-details',
  templateUrl: './home-details.page.html',
  styleUrls: ['./home-details.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonGrid, IonRow, IonCol, IonLabel, IonSegmentButton, IonSegment, IonCard, IonChip, IonPopover,
    IonIcon, IonButton, IonBackButton, IonButtons, CustomSpinnerPage, IonContent, IonHeader, HomeViewComponent,
    FullscreenViewPage, IonModal,RouterLink,TranslateModule,
    IonToolbar, CommonModule, FormsModule, DotToCommaPipe, SecureUrlPipe, FullscreenViewPage]
})
export class HomeDetailsPage implements OnInit {

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
  home!: Home;
  homes: Home[] = [];
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
  isPreviousLoading = true;
  isFullViewOpen = false;
  galleryViewIndex = 0;
  galleryImages: string[] = [];
  userLocation!: { lat: number; lng: number };
  distance = '';
  language$!:Subscription;
  language='';
  private destroy$=new Subject<void>();


  constructor(private homeService: HomeService, private districtService: DistrictService, private favoriteService: FavoriteService,
    private agentService: AgentService, private valutaService: ValutaService, private currencyPipe: CurrencyPipe,
    private toast: ToastService, private popoverCtrl: PopoverController, private mapService: MapService,private languageService:LanguageService,
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
        if (routePath.includes('houses/rental')) {
          this.isRental = true;
        } else {
          this.isRental = false;
        }
      });
    this.route.paramMap
      .pipe(take(1))
      .subscribe(param => {
        const id = param.get('id');
        console.log('id',id);
        if (id) {
          this.id = id;
          this.fetchData();
        }
      })
  }

  updateGalleryViewIndex(event: any) {
    this.galleryViewIndex = event.target.swiper.realIndex;

  }

  async share() {
    await Share.share({
      title: this.home.title.rendered,
      text: this.isRental ? this.home['toolset-meta']['details-huurwoning'].subtitel.raw : this.home['toolset-meta']['details-koopwoning'].subtitel.raw,
      url: this.home.link,
    });
  }


  dismissModal() {
    this.isFullViewOpen = false;
  }

  fetchSimilarHomes() {
    const filter: IFilter = {
      excludeId: this.id,
      type: [DataTypes.HOME]
    }
    if (this.isRental) {
      this.homeService.onApplyRentHomeFilter(filter, this.districts, this.valutaOptions, 5)
        .pipe(take(1))
        .subscribe(homes => {
          this.homes = homes;
          this.isSimilarHomesLoading = false;
        })

    } else {
      this.homeService.onApplyBuyHomeFilter(filter, this.districts, this.valutaOptions, 5)
        .pipe(take(1))
        .subscribe(homes => {
          this.homes = homes;
          this.isSimilarHomesLoading = false;
        })

    }
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
        type: this.isRental ? ListingType.RENTALHOME : ListingType.HOME
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

  openFullView() {
    this.galleryImages = this.home.gallery_thumbnails.map(r => r.full);
    this.isFullViewOpen = true;
  }

  async fetchData() {
    this.favorites = await this.favoriteService.getFavorites();
    if (this.favorites.findIndex(f => f.id === this.id) >= 0) {
      this.isFavorite = true;
    }

    combineLatest([this.homeService.homeTypesLoading$, this.districtService.isLoading$, this.valutaService.isLoading$])
      .pipe(filter(([loading, districtLoading, valutaLoading]) => !loading && !districtLoading && !valutaLoading),
        take(1),
        switchMap(_ => {
          console.log('first combine latest');
          this.valutaOptions = this.valutaService.valueOptions;
          this.districts = this.districtService.districts;
          this.homeTypes = this.homeService.homeTypes;
          return combineLatest([this.homeService.getPropertyById(this.id, this.districts, this.valutaOptions, this.isRental ? true : false),
          this.isRental ? this.homeService.getRentalHouseStatus() : this.homeService.getHouseStatus(),
          this.isRental ? this.agentService.getMakeelarFromRentalHouseListing(this.id) : this.agentService.getMakeelarFromHouseListing(this.id)]);
        })
      )
      .subscribe(([home, houseStatuses, broker]) => {
        this.houseStatuses = houseStatuses;
        console.log('home', home);
        this.home = home;
        if (this.mapService.address && Object.keys(this.mapService.address).length > 0 &&
          this.mapService.address.country_code === 'sr' && this.home['wpcf-kaart'] &&
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

        if(broker){
          this.home.broker = broker as any;
        }
        this.fetchSimilarHomes();
        // this.mapService.getMapImage(this.home['wpcf-kaart']);

        if (this.isRental) {
          const status = this.houseStatuses.find(s => s.value === this.home['wpcf-huurobject-status']);
          if (status) {
            this.home.status = status.title;
          }

        } else {
          const status = this.houseStatuses.find(s => s.value === this.home['wpcf-koopobject-status']);
          if (status) {
            this.home.status = status.title;
          }

        }

        const homeType = this.homeTypes.find(h => h.value === this.home['wpcf-type-woning']);

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
          }
        }
        if (homeType) {
          this.home.type = homeType.title;
        }
        if (this.home['wpcf-prijs-zonder-punten'] || this.home['wpcf-huurprijs-pm-zp']) {
          this.fetchPrice();
        }
        else {
          this.isLoading = false;

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
    this.displayedContent = this.showFullContent ? this.home.content.rendered : this.home.content.rendered.slice(0, this.maxLength) + '<p class="read">Read more</p>';
  }

  fetchPrice() {
    if (this.isRental) {
      const price=this.home['wpcf-huurprijs-pm-zp'];
      const transformedPrice = price.replace(/\./g, '');
      if (this.home.isEuro) {
        combineLatest([this.currencyService.convertPrice(transformedPrice, 'usd'),
        this.currencyService.convertPrice(this.home['wpcf-huurprijs-pm-zp'], 'srd')
        ]).pipe(take(1))
          .subscribe(([usd, srd]) => {
            this.home.eur = this.currencyPipe.transform(transformedPrice, 'EUR', 'symbol', '1.0-2') as string
            this.home.srd = this.currencyPipe.transform(srd.converted_price, 'SRD', 'symbol', '1.0-2') as string
            this.home.usd = this.currencyPipe.transform(usd.converted_price, 'EUR', 'symbol', '1.0-2') as string
            this.isLoading = false;
            // setTimeout(() => {
            //   this.initializeSlides();
            // }, 800);

          },err=>{
            console.log('error',err);
            this.isLoading = false;
          })

      } else if (this.home.isUsd) {
        combineLatest([this.currencyService.convertPrice(transformedPrice, 'eur', 'usd'),
        this.currencyService.convertPrice(transformedPrice, 'srd', 'usd')
        ]).pipe(take(1))
          .subscribe(([eur, srd]) => {
            this.home.usd = this.currencyPipe.transform(transformedPrice, 'USD', 'symbol', '1.0-2') as string
            this.home.srd = this.currencyPipe.transform(srd.converted_price, 'SRD', 'symbol', '1.0-2') as string
            this.home.eur = this.currencyPipe.transform(eur.converted_price, 'EUR', 'symbol', '1.0-2') as string
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
            this.home.srd = this.currencyPipe.transform(transformedPrice, 'SRD', 'symbol', '1.0-2') as string
            this.home.eur = this.currencyPipe.transform(eur.converted_price, 'EUR', 'symbol', '1.0-2') as string
            this.home.usd = this.currencyPipe.transform(usd.converted_price, 'USD', 'symbol', '1.0-2') as string
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
      const price=this.home['wpcf-prijs-zonder-punten'];
      const transformedPrice = price.replace(/\./g, '');
      if (this.home.isEuro) {
        combineLatest([this.currencyService.convertPrice(transformedPrice, 'usd'),
        this.currencyService.convertPrice(transformedPrice, 'srd')
        ]).pipe(take(1))
          .subscribe(([usd, srd]) => {
            this.home.eur = this.currencyPipe.transform(transformedPrice, 'EUR', 'symbol', '1.0-2') as string
            this.home.srd = this.currencyPipe.transform(srd.converted_price, 'SRD', 'symbol', '1.0-2') as string
            this.home.usd = this.currencyPipe.transform(usd.converted_price, 'EUR', 'symbol', '1.0-2') as string
            this.isLoading = false;
            console.log('is Loading');
            // setTimeout(() => {
            //   this.initializeSlides();
            // }, 800);

          },err=>{
            console.log('error',err);
            this.isLoading = false;
          })

      } else if (this.home.isUsd) {
        combineLatest([this.currencyService.convertPrice(transformedPrice, 'eur', 'usd'),
        this.currencyService.convertPrice(transformedPrice, 'srd', 'usd')
        ]).pipe(take(1))
          .subscribe(([eur, srd]) => {
            this.home.usd = this.currencyPipe.transform(transformedPrice, 'USD', 'symbol', '1.0-2') as string
            this.home.srd = this.currencyPipe.transform(srd.converted_price, 'SRD', 'symbol', '1.0-2') as string
            this.home.eur = this.currencyPipe.transform(eur.converted_price, 'EUR', 'symbol', '1.0-2') as string
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
            this.home.srd = this.currencyPipe.transform(transformedPrice, 'SRD', 'symbol', '1.0-2') as string
            this.home.eur = this.currencyPipe.transform(eur.converted_price, 'EUR', 'symbol', '1.0-2') as string
            this.home.usd = this.currencyPipe.transform(usd.converted_price, 'USD', 'symbol', '1.0-2') as string
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

}
