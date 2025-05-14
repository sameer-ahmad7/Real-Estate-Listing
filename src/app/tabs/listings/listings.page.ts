import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLabel, IonCheckbox,
  IonSelect, IonInfiniteScroll, IonInfiniteScrollContent, ModalController,
  IonSegmentButton, IonCard, IonSegment, IonInput, IonText,PopoverController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { location, home, chevronDownCircleOutline } from 'ionicons/icons';
import { HomeService } from 'src/app/services/home.service';
import { DistrictService } from 'src/app/services/district.service';
import { BusinessPropertyService } from 'src/app/services/business-property.service';
import { PlotService } from 'src/app/services/plot.service';
import { combineLatest, filter, Observable, of, Subject, Subscription, take, takeUntil } from 'rxjs';
import { District } from 'src/app/model/districts.model';
import { Home } from 'src/app/model/home.model';
import { BusinessProperty } from 'src/app/model/business-property.model';
import { Rental } from 'src/app/model/rental.model';
import { Plot } from 'src/app/model/plot.model';
import { Pricing } from 'src/app/model/price.model';
import { BusinessPropertyFilter, DataTypes, HolidayHomeFilter, HouseFilter, IFilter, PlotFilter } from 'src/app/model/filter.model';
import { PricingService } from 'src/app/services/pricing.service';
import { HolidayHomeService } from 'src/app/services/holiday-home.service';
import { HolidayHome } from 'src/app/model/holiday-home.model';
import { IonInfiniteScrollCustomEvent, IonRefresherCustomEvent, IonSelectCustomEvent,
   RefresherEventDetail, SelectChangeEventDetail } from '@ionic/core';
import { HomeViewComponent } from "../../pages/home-view/home-view.component";
import { HolidayHomeViewComponent } from 'src/app/pages/holiday-home-view/holiday-home-view.component';
import { PlotViewComponent } from 'src/app/pages/plot-view/plot-view.component';
import { BusinessPropertyViewComponent } from "../../pages/business-property-view/business-property-view.component";
import { HomesListingPage } from 'src/app/pages/homes-listing/homes-listing.page';
import { PlotListingPage } from 'src/app/pages/plot-listing/plot-listing.page';
import { HolidayPropertyListingPage } from 'src/app/pages/holiday-property-listing/holiday-property-listing.page';
import { BusinessPropertyListingPage } from 'src/app/pages/business-property-listing/business-property-listing.page';
import { ValutaOptions } from 'src/app/model/valuta-model';
import { ValutaService } from 'src/app/services/valuta.service';
import { MapService } from 'src/app/services/map.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Capacitor } from '@capacitor/core';
import { CustomSpinnerPage } from 'src/app/pages/custom-spinner/custom-spinner.page';
import { LanguageMenuPage } from "../../shared/language-menu/language-menu.page";
import { LanguageService } from 'src/app/services/language.service';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-listings',
  templateUrl: './listings.page.html',
  styleUrls: ['./listings.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ModalController],
  imports: [IonText, IonInput, IonSegment, IonCheckbox, IonCard, IonSegmentButton, IonLabel, IonButton, IonContent, IonHeader, IonTitle,
    IonSelect, HomeViewComponent, HolidayHomeViewComponent, PlotViewComponent, IonInfiniteScroll, IonInfiniteScrollContent,TranslateModule,
    IonToolbar, CommonModule, FormsModule, HomeViewComponent, BusinessPropertyViewComponent, CustomSpinnerPage, LanguageMenuPage]
})
export class ListingsPage implements OnInit, OnDestroy {

  location!: string; // Default location
  isFilterApplied = false;
  appliedFilter!: IFilter;
  isLoading = true;
  isNearby = false;
  properties$!: Subscription;
  districts: District[] = [];
  homes: Home[] = [];
  valutaOptions: ValutaOptions[] = [];
  businessProperties: BusinessProperty[] = [];
  rentals: Rental[] = [];
  plots: Plot[] = [];
  pricings: Pricing[] = [];
  buyPricings: Pricing[] = [];
  holidayHomes: HolidayHome[] = [];
  rentalPricings: Pricing[] = [];
  dataTypes: DataTypes[] = [DataTypes.HOME, DataTypes.BUSINESS_PROPERTY, DataTypes.PLOT];
  selectedBuyDataType: DataTypes[] = [];
  selectedBuyPricing!: string;
  selectedRentalDataType: DataTypes[] = [];
  selectedRentalPricing!: string;
  searchQuery = '';
  selectedSegment = 'buy';
  currentPageNo = 1;
  event?: IonInfiniteScrollCustomEvent<void>;
  isScrollDisabled = false;
  isRefreshing = false;
  isInit = true;
  language$!:Observable<string>;


  private destroy$ = new Subject<void>();
  refresherEvent!: IonRefresherCustomEvent<RefresherEventDetail> | null;

  constructor(private homeService: HomeService, private holidayService: HolidayHomeService, private districtService: DistrictService,
    private businessPropertyService: BusinessPropertyService, private modalCtrl: ModalController, private mapService: MapService,
    private plotService: PlotService, private pricingService: PricingService, private valutaService: ValutaService,
    private notificationService: NotificationService,private languageService:LanguageService,private popoverCtrl:PopoverController)
   {
    addIcons({ location, home, chevronDownCircleOutline });
  }

  get dataTypesEnum() {
    return DataTypes;
  }


  ngOnInit() {

    this.language$=this.languageService.language$;

    combineLatest(([this.pricingService.buyPriceLoading$, this.pricingService.rentalPriceLoading$,
    this.mapService.isLoading$,
    this.districtService.isLoading$,
    this.valutaService.isLoading$]))
      .pipe(filter(([buyLoading, rentalLoading, mapLoading, isDistrictsLoading, valutaLoading]) => !buyLoading && !rentalLoading && !mapLoading && !isDistrictsLoading && !valutaLoading),
        take(1))
      .subscribe(_ => {
        if (this.isInit) {
          if (Capacitor.isNativePlatform()) {
            this.notificationService.init();
          }
          this.isInit = false;
        }
        this.listenForLocationUpdates();
        const address = this.mapService.address;
        if (address && Object.keys(address).length > 0) {
          if (address.road) {
            this.location = `${address.road}, ${address.state}`;
          } else {
            this.location = `${address.residential}, ${address.state}`;
          }
          if (address.country_code === 'sr') {
            this.isNearby = true;
            this.searchQuery = this.location;
          }
        }
        this.valutaOptions = this.valutaService.valueOptions;
        this.buyPricings = this.pricingService.buyPricings;
        this.rentalPricings = this.pricingService.rentalPricings;
        this.pricings = this.buyPricings;
        this.districts = this.districtService.districts;
        this.onApplyFilter();

      });
  }

  async openLanguageMenu(ev: any) {
    const popover=await  this.popoverCtrl.create({
        component: LanguageMenuPage,
        event: ev,
    });
    await popover.present();
  }


  onSearchQueryChanged(event: any) {
    this.isNearby = false;
  }

  listenForLocationUpdates() {
    this.mapService.address$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(address => {
      if (address && Object.keys(address).length > 0) {
        if (address.road) {
          this.location = `${address.road}, ${address.state}`;
        } else {
          this.location = `${address.residential}, ${address.state}`;
        }
      }
    });
  }


  handleRefresh(event: IonRefresherCustomEvent<RefresherEventDetail>) {
    this.isLoading = true;
    this.isRefreshing = true;
    this.currentPageNo = 1;
    this.refresherEvent = event;
    this.fetchData();
  }


  onPriceChanged(event: IonSelectCustomEvent<SelectChangeEventDetail<any>>) {
    if (this.selectedSegment === 'buy') {
      this.selectedBuyPricing = event.target.value;

    } else {
      this.selectedRentalPricing = event.target.value;

    }
  }

  onSelectedTypesChanged(event: IonSelectCustomEvent<SelectChangeEventDetail<any>>) {
    if (this.selectedSegment === 'buy') {
      this.selectedBuyDataType = event.target.value;
    } else {
      this.selectedRentalDataType = event.target.value;
    }
  }

  async onViewAllBusinessProperties() {
    const appliedFilter: BusinessPropertyFilter = {
      search: this.searchQuery ?? '',
      priceRange: this.appliedFilter.priceRange ?? '',
    }

    const modal = await this.modalCtrl.create({
      component: BusinessPropertyListingPage,
      componentProps: {
        isModal: true,
        isRental: this.appliedFilter.isRental ? true : false,
        appliedFilter
      }
    });
    await modal.present();
  }


  async onViewAllHolidayHomes() {
    const appliedFilter: HolidayHomeFilter = {
      search: this.searchQuery ?? '',
      priceRange: this.appliedFilter.priceRange ?? '',
    }
    const modal = await this.modalCtrl.create({
      component: HolidayPropertyListingPage,
      componentProps: {
        isModal: true,
        appliedFilter
      }
    });
    await modal.present();
  }


  async onViewAllPlots() {
    const appliedFilter: PlotFilter = {
      search: this.searchQuery ?? '',
      priceRange: this.appliedFilter.priceRange ?? '',
    }

    const modal = await this.modalCtrl.create({
      component: PlotListingPage,
      componentProps: {
        isModal: true,
        appliedFilter
      }
    });
    await modal.present();
  }


  async onViewAllHomes() {
    const appliedFilter: HouseFilter = {
      search: this.searchQuery ?? '',
      priceRange: this.appliedFilter.priceRange ?? '',
    }
    const modal = await this.modalCtrl.create({
      component: HomesListingPage,
      componentProps: {
        isModal: true,
        isRental: this.appliedFilter.isRental ? true : false,
        appliedFilter
      }
    });
    await modal.present();
  }

  onSegmentChanged() {
    if (this.selectedSegment === 'buy') {
      this.dataTypes = this.dataTypes.filter(d => d !== DataTypes.HOLIDAY_HOME);
      this.pricings = this.buyPricings;
    } else {
      this.dataTypes = this.dataTypes.filter(d => d !== DataTypes.PLOT);
      this.dataTypes.push(DataTypes.HOLIDAY_HOME);
      this.pricings = this.rentalPricings;
    }
  }

  onNearbyChanged(event: any) {
    if (event.detail.checked) {
      this.searchQuery = this.location;
    } else {
      this.searchQuery = '';
    }
  }

  onResetFilter() {
    this.searchQuery = this.location;
    this.isNearby = false;
    this.isLoading = true;
    this.currentPageNo = 1;
    this.event = null as any;
    this.appliedFilter = {
      type: []
    };
    this.businessProperties = [];
    this.homes = [];
    this.holidayHomes = [];
    this.plots = [];
    this.selectedBuyDataType = [];
    this.selectedBuyPricing = '';
    this.selectedRentalDataType = [];
    this.selectedRentalPricing = '';
    this.fetchData();
  }

  onApplyFilter() {
    this.currentPageNo = 0;
    this.event = null as any;
    this.isScrollDisabled = false;
    this.isLoading = true;
    this.businessProperties = [];
    this.homes = [];
    this.holidayHomes = [];
    this.plots = [];
    this.appliedFilter = {
      type: []
    };
    if (this.selectedSegment === 'rent') {
      this.appliedFilter.isRental = true;
      if (this.selectedRentalDataType.length > 0) {
        this.appliedFilter.type = [...this.selectedRentalDataType];
      } else {
        this.appliedFilter.type = [];
      }

      if (this.selectedRentalPricing) {
        this.appliedFilter.priceRange = this.selectedRentalPricing;
      } else {
        this.appliedFilter.priceRange = '';
      }

    } else {
      this.appliedFilter.isRental = false;
      if (this.selectedBuyDataType.length > 0) {
        this.appliedFilter.type = [...this.selectedBuyDataType];
      } else {
        this.appliedFilter.type = [];
      }

      if (this.selectedBuyPricing) {
        this.appliedFilter.priceRange = this.selectedBuyPricing;
      } else {
        this.appliedFilter.priceRange = '';
      }

    }
    if (this.searchQuery && this.searchQuery.trim()) {
      this.appliedFilter.search = this.searchQuery.trim()
    } else {
      this.appliedFilter.search = '';
    }
    this.fetchData();
  }

  fetchData(isScroll: boolean = false) {
    combineLatest([this.applyFilterOnHomes(), this.applyFilterOnPlots(), this.applyFilterOnBusinessProperties(), this.applyFilterOnHolidayHomes()])
      .pipe(take(1))
      .subscribe(([homes, plots, businessProperties, holidayHomes]) => {
        this.currentPageNo++;
        let noData = false;
        console.log(homes);
        if (isScroll) {
          this.homes = [...this.homes, ...homes];
          this.plots = [...this.plots, ...plots];
          this.businessProperties = [...this.businessProperties, ...businessProperties];
          this.holidayHomes = [...this.holidayHomes, ...holidayHomes];

        }
        else {
          this.homes = [...homes];
          this.plots = [...plots];
          this.businessProperties = [...businessProperties];
          this.holidayHomes = [...holidayHomes];

        }
        if (homes.length === 0 && plots.length === 0 && businessProperties.length === 0 && holidayHomes.length === 0) {
          noData = true;
        }
        this.isLoading = false;
        this.isFilterApplied = true;
        setTimeout(() => {
          if (this.refresherEvent) {
            this.refresherEvent.target.complete();
            this.isRefreshing = false;
          }
          if (this.event) {
            this.event.target.complete();
            if (noData) {
              this.isScrollDisabled = true;
            }
            this.event = null as any;
          }
        }, 500);
        // this.event=null as any;
      })

  }

  onIonInfinite(event: IonInfiniteScrollCustomEvent<void>) {
    this.event = event;
    this.fetchData(true);
  }

  applyFilterOnHomes() {
    if (this.appliedFilter.type.length === 0 || this.appliedFilter.type.includes(this.dataTypesEnum.HOME)) {
      if (this.appliedFilter.type?.length === 1) {
        return this.selectedSegment === 'buy' ? this.homeService.onApplyBuyHomeFilter(this.appliedFilter, this.districts, this.valutaOptions, 10, this.currentPageNo) : this.homeService.onApplyRentHomeFilter(this.appliedFilter, this.districts, this.valutaOptions, 10, this.currentPageNo);
      } else {
        return this.selectedSegment === 'buy' ? this.homeService.onApplyBuyHomeFilter(this.appliedFilter, this.districts, this.valutaOptions, 5) : this.homeService.onApplyRentHomeFilter(this.appliedFilter, this.districts, this.valutaOptions, 5);
      }
    } else {
      return of([]);
    }

  }
  applyFilterOnHolidayHomes() {
    if ((this.appliedFilter.type.length === 0 || this.appliedFilter.type.includes(this.dataTypesEnum.HOLIDAY_HOME)) && this.selectedSegment !== 'buy') {
      if (this.appliedFilter.type?.length === 1) {
        return this.holidayService.onApplyFilter(this.appliedFilter, this.districts, this.valutaOptions, 10, this.currentPageNo);
      } else {
        return this.holidayService.onApplyFilter(this.appliedFilter, this.districts, this.valutaOptions, 5, this.currentPageNo);
      }
    } else {
      return of([]);
    }

  }


  applyFilterOnPlots() {
    if (this.appliedFilter.type.length === 0 || this.appliedFilter.type.includes(this.dataTypesEnum.PLOT) && this.selectedSegment === 'buy') {
      if (this.appliedFilter.type?.length === 1) {
        return this.plotService.onApplyBuyPlotFilter(this.appliedFilter, this.districts, this.valutaOptions, 10, this.currentPageNo);
      } else {
        return this.plotService.onApplyBuyPlotFilter(this.appliedFilter, this.districts, this.valutaOptions, 5);
      }
    } else {
      return of([]);
    }

  }

  applyFilterOnBusinessProperties() {
    if (this.appliedFilter.type.length === 0 || this.appliedFilter.type.includes(this.dataTypesEnum.BUSINESS_PROPERTY)) {
      if (this.appliedFilter.type?.length === 1) {
        return this.selectedSegment === 'buy' ? this.businessPropertyService.onApplyBuyBusinessPropertyFilter(this.appliedFilter, this.districts, this.valutaOptions, 10, this.currentPageNo) : this.businessPropertyService.onApplyRentalBusinessPropertyFilter(this.appliedFilter, this.districts, this.valutaOptions, 10, this.currentPageNo);
      } else {
        return this.selectedSegment === 'buy' ? this.businessPropertyService.onApplyBuyBusinessPropertyFilter(this.appliedFilter, this.districts, this.valutaOptions, 5) : this.businessPropertyService.onApplyRentalBusinessPropertyFilter(this.appliedFilter, this.districts, this.valutaOptions, 5);
      }
    } else {
      return of([]);
    }

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
