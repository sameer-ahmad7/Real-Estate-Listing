import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, PopoverController, IonSegment, IonModal,
  IonButtons, IonBackButton, IonButton, IonIcon, IonCard, IonSegmentButton,
  IonLabel, IonText, IonRow, IonGrid, IonCol, IonChip, IonPopover
} from '@ionic/angular/standalone';
import { DotToCommaPipe } from 'src/app/pipes/dot-to-comma.pipe';
import { LandTitle } from 'src/app/model/land-title.model';
import { Plot } from 'src/app/model/plot.model';
import { HouseStatus } from 'src/app/model/home.model';
import { District } from 'src/app/model/districts.model';
import { LandTitleService } from 'src/app/services/land-title.service';
import { PlotService } from 'src/app/services/plot.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AgentService } from 'src/app/services/agent.service';
import { CurrencyService } from 'src/app/services/currency.service';
import { DistrictService } from 'src/app/services/district.service';
import { HomeService } from 'src/app/services/home.service';
import { chevronBack, ellipsisVertical } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { combineLatest, filter, Subject, Subscription, switchMap, take, takeUntil } from 'rxjs';
import { DataTypes, IFilter } from 'src/app/model/filter.model';
import { SwiperOptions } from 'swiper/types';
import { PlotViewComponent } from "../plot-view/plot-view.component";
import { ValutaOptions } from 'src/app/model/valuta-model';
import { ValutaService } from 'src/app/services/valuta.service';
import { Share } from '@capacitor/share';
import { Favorite, ListingType } from 'src/app/model/favorite.model';
import { FavoriteService } from 'src/app/services/favorite.service';
import { ToastService } from 'src/app/services/toast.service';
import { SecureUrlPipe } from "../../pipes/secure-url.pipe";
import { environment } from 'src/environments/environment';
import { MediaService } from 'src/app/services/media.service';
import { RepeatableMedia } from 'src/app/model/media.model';
import { FullscreenViewPage } from '../fullscreen-view/fullscreen-view.page';
import { getDistanceInKm } from 'src/app/utils/distance';
import { MapService } from 'src/app/services/map.service';
import { CustomSpinnerPage } from '../custom-spinner/custom-spinner.page';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { PhoneContactComponent } from 'src/app/shared/phone-contact/phone-contact.component';

@Component({
  selector: 'app-plot-details',
  templateUrl: './plot-details.page.html',
  styleUrls: ['./plot-details.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonChip, IonCol, IonGrid, IonRow, IonText, IonLabel, PlotViewComponent, IonPopover, FullscreenViewPage,
    IonSegmentButton, IonCard, IonIcon, IonButton, IonBackButton, IonButtons, IonSegment, IonModal,RouterLink,TranslateModule,
    CustomSpinnerPage, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, DotToCommaPipe, PlotViewComponent, SecureUrlPipe]
})
export class PlotDetailsPage implements OnInit {

  favorites: Favorite[] = [];
  isFavorite = false;
  valutaOptions: ValutaOptions[] = [];
  showFullContent = false;
  displayedContent = '';
  maxLength: number = 150;
  isLoading = true;
  isSimilarPlotsLoading = true;
  landTitles: LandTitle[] = [];
  plot!: Plot;
  plots: Plot[] = [];
  id = '';
  lat!: number;
  lng!: number;
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


  constructor(private homeService: HomeService, private landTitleService: LandTitleService, private districtService: DistrictService,
    private agentService: AgentService, private plotService: PlotService, private valutaService: ValutaService, private currencyPipe: CurrencyPipe,
    private currencyService: CurrencyService, private favoriteService: FavoriteService, private toast: ToastService,
    private languageService: LanguageService, private mapService: MapService,private popoverCtrl:PopoverController,
    private route: ActivatedRoute) {
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




  ngDoCheck() {
    // Detect change in `isLoading`
    if (this.isPreviousLoading !== this.isLoading && !this.isLoading) {
      this.isPreviousLoading = this.isLoading;
      setTimeout(() => {
        if (this.plot.gallery_thumbnails.length > 0) {
          this.initializeSlides();
        }
      }, 1200); // Delay ensures DOM updates


    }
  }



  fetchSimilarPlots() {
    const filter: IFilter = {
      excludeId: this.id,
      type: [DataTypes.PLOT]
    }
    this.plotService.onApplyBuyPlotFilter(filter, this.districts, this.valutaOptions, 5)
      .pipe(take(1))
      .subscribe(plots => {
        this.plots = plots;
        this.isSimilarPlotsLoading = false;
      })

  }


  async share() {
    await Share.share({
      title: this.plot.title.rendered,
      text: this.plot['toolset-meta']['details-perceel'].subtitel.raw,
      url: this.plot.link,
    });
  }

  async fetchData() {
    this.favorites = await this.favoriteService.getFavorites();
    if (this.favorites.findIndex(f => f.id === this.id) >= 0) {
      this.isFavorite = true;
    }
    combineLatest([this.landTitleService.isLoading$, this.districtService.isLoading$, this.valutaService.isLoading$])
      .pipe(filter(([loading, districtLoading, valutaLoading]) => !loading && !districtLoading && !valutaLoading),
        take(1),
        switchMap(([_, __]) => {
          this.valutaOptions = this.valutaService.valueOptions;
          this.districts = this.districtService.districts;
          this.landTitles = this.landTitleService.landTitles;
          return combineLatest([this.plotService.getPlotById(this.id, this.districts, this.valutaOptions),
          this.homeService.getHouseStatus(),
          this.agentService.getMakeelarFromPlotListing(this.id)]);
        })
      )
      .subscribe(([plot, houseStatuses, broker]) => {
        this.houseStatuses = houseStatuses;
        this.plot = plot;
        this.plot.broker = broker as any;
        this.fetchSimilarPlots();
        const landTitle = this.landTitles.find(l => l.value === plot['wpcf-grondtitel']);
        if (landTitle) {
          this.plot.landTitle = landTitle.title;
        }
        const status = this.houseStatuses.find(s => s.value === this.plot['wpcf-koopobject-status']);
        if (status) {
          this.plot.status = status.title;
        }

        if (this.mapService.address && Object.keys(this.mapService.address).length > 0 &&
          this.mapService.address.country_code === 'sr' && plot['wpcf-kaart'] &&
          this.mapService.address.lat && this.mapService.address.lng) {
          this.userLocation = {
            lat: this.mapService.address.lat,
            lng: this.mapService.address.lng
          }
          const location = this.plot['wpcf-kaart'];
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
          this.displayedContent = this.plot.content.rendered.slice(0, this.maxLength) + '<p class="read">Read more</p>';
        }else{
          this.displayedContent = this.plot.content.rendered.slice(0, this.maxLength) + '<p class="read">Lees meer</p>';

        }
        if(this.plot['wpcf-kaart']){
        const location = this.plot['wpcf-kaart'];
        const regex = /{(-?[\d.]+),(-?[\d.]+)}/;
        const match = location.match(regex);
        if (match) {
          this.lat = parseFloat(match[1]);
          this.lng = parseFloat(match[2]);
          this.mapURL = `${this.mapBaseURL}?center=${this.lat},${this.lng}&zoom=18&size=540x400&maptype=hybrid&markers=${this.lat},${this.lng}&key=${this.apiKey}`;
        }
      }
        if (this.plot['wpcf-prijs-zonder-punten'] || this.plot['wpcf-huurprijs-pm-zp']) {
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



  async toggleFavorite(popover: IonPopover) {
    if (this.isFavorite) {
      await this.favoriteService.removeFavorite(this.id);
      this.favorites = await this.favoriteService.getFavorites();
      this.toast.show('Removed from favorites');
      this.isFavorite = false;
    } else {
      const favorite: Favorite = {
        id: this.id,
        type: ListingType.PLOT
      }
      await this.favoriteService.addFavorite(favorite);
      this.toast.show('Added to favorites');
      this.isFavorite = true;
    }
    popover.dismiss();
  }

  openFullView() {
    this.galleryImages = this.plot.gallery_thumbnails.map(r => r.full);
    this.isFullViewOpen = true;
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
    this.displayedContent = this.showFullContent ? this.plot.content.rendered : this.plot.content.rendered.slice(0, this.maxLength) + '<p class="read">Read more</p>';
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




  fetchPrice() {

    const price=this.plot['wpcf-prijs-zonder-punten'];
    const transformedPrice = price.replace(/\./g, '');

    if (this.plot.isEuro) {
      combineLatest([this.currencyService.convertPrice(transformedPrice, 'usd'),
      this.currencyService.convertPrice(transformedPrice, 'srd')
      ]).pipe(take(1))
        .subscribe(([usd, srd]) => {
          this.plot.eur = this.currencyPipe.transform(transformedPrice, 'EUR', 'symbol', '1.0-2') as string
          this.plot.srd = this.currencyPipe.transform(srd.converted_price, 'SRD', 'symbol', '1.0-2') as string
          this.plot.usd = this.currencyPipe.transform(usd.converted_price, 'EUR', 'symbol', '1.0-2') as string
          this.isLoading = false;
          // setTimeout(() => {
          //   this.initializeSlides();
          // }, 800);

        },err=>{
          console.log('error',err);
          this.isLoading = false;
        })

    } else if (this.plot.isUsd) {
      combineLatest([this.currencyService.convertPrice(transformedPrice, 'eur', 'usd'),
      this.currencyService.convertPrice(transformedPrice, 'srd', 'usd')
      ]).pipe(take(1))
        .subscribe(([eur, srd]) => {
          this.plot.usd = this.currencyPipe.transform(transformedPrice, 'USD', 'symbol', '1.0-2') as string
          this.plot.srd = this.currencyPipe.transform(srd.converted_price, 'SRD', 'symbol', '1.0-2') as string
          this.plot.eur = this.currencyPipe.transform(eur.converted_price, 'EUR', 'symbol', '1.0-2') as string
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
          this.plot.srd = this.currencyPipe.transform(transformedPrice, 'SRD', 'symbol', '1.0-2') as string
          this.plot.eur = this.currencyPipe.transform(eur.converted_price, 'EUR', 'symbol', '1.0-2') as string
          this.plot.usd = this.currencyPipe.transform(usd.converted_price, 'USD', 'symbol', '1.0-2') as string
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
