import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonSegment, IonSelect, IonInput, IonSelectOption,
  IonButtons, IonButton, IonIcon, IonBackButton, IonInfiniteScroll, IonInfiniteScrollContent, IonCard, ModalController, IonRefresher, IonRefresherContent, IonSegmentButton, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { HolidayHome } from 'src/app/model/holiday-home.model';
import { HolidayHomeService } from 'src/app/services/holiday-home.service';
import { IonInfiniteScrollCustomEvent, IonRefresherCustomEvent, RefresherEventDetail } from '@ionic/core';
import { addIcons } from 'ionicons';
import { chevronBack, chevronDownCircleOutline, home, location, gridOutline, listOutline } from 'ionicons/icons';
import { combineLatest, filter, take } from 'rxjs';
import { District } from 'src/app/model/districts.model';
import { DistrictService } from 'src/app/services/district.service';
import { HolidayHomeFilter, IFilter } from 'src/app/model/filter.model';
import { HolidayHomeViewComponent } from '../holiday-home-view/holiday-home-view.component';
import { HomeTypes } from 'src/app/model/home.model';
import { Pricing } from 'src/app/model/price.model';
import { HomeService } from 'src/app/services/home.service';
import { PricingService } from 'src/app/services/pricing.service';
import { ValutaOptions } from 'src/app/model/valuta-model';
import { ValutaService } from 'src/app/services/valuta.service';
import { CustomSpinnerPage } from "../custom-spinner/custom-spinner.page";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-holiday-property-listing',
  templateUrl: './holiday-property-listing.page.html',
  styleUrls: ['./holiday-property-listing.page.scss'],
  standalone: true,
  providers: [ModalController],
  imports: [IonCol, IonRow, IonGrid, IonSegmentButton, IonRefresherContent, IonRefresher, IonCard, IonSegmentButton,IonSegment,
    IonInfiniteScrollContent, IonInfiniteScroll, IonBackButton, HolidayHomeViewComponent,
    IonIcon, IonButton, IonButtons, CustomSpinnerPage, IonContent, TranslateModule, IonHeader, IonSelect, IonSelectOption, IonInput,
    IonTitle, IonToolbar, CommonModule, FormsModule, CustomSpinnerPage]
})
export class HolidayPropertyListingPage implements OnInit {

  searchQuery = '';
  refresherEvent!: IonRefresherCustomEvent<RefresherEventDetail> | null;

  homes: HolidayHome[] = [];
  districts: District[] = [];
  currentPageNo = 0;

  valutas: ValutaOptions[] = [];


  appliedFilter!: HolidayHomeFilter;

  pricings: Pricing[] = [];
  selectedDistrict = '';
  homeTypes: HomeTypes[] = [];
  isPricesLoading = true;
  selectedRentalPricing!: string;
  selectedPropertyType = '';


  isLoading = true;
  isModal = false;


  event?: IonInfiniteScrollCustomEvent<void>;
  isScrollDisabled = false;

  isRefreshing=false;
  viewMode:'list'|'grid'='grid';

  constructor(private holidayHomeService: HolidayHomeService, private districtService: DistrictService,
    private pricingService: PricingService, private valutaService: ValutaService,
    private modalController: ModalController, private homeService: HomeService) {
    addIcons({chevronBack,gridOutline,listOutline,home,location,chevronDownCircleOutline});
  }

  ngOnInit() {

    this.fetchData()

  }

  handleRefresh(event: IonRefresherCustomEvent<RefresherEventDetail>) {
    this.isLoading=true;
    this.isRefreshing=true;
    this.currentPageNo = 0;
    this.refresherEvent = event;
    this.fetchHomes();
  }


  fetchData() {
    if (this.isModal) {
      combineLatest(([this.districtService.isLoading$, this.valutaService.isLoading$]))
        .pipe(
          filter(([isDistrictLoading, isValutaLoading]) => !isDistrictLoading && !isValutaLoading),
          take(1)
        )
        .subscribe(_ => {
          this.valutas = this.valutaService.valueOptions;
          this.districts = this.districtService.districts;
          this.fetchHomes();
        })
    } else {
      // this.homeService.getHomeTypes();
      this.pricingService.rentalPriceLoading$
        .pipe(filter(loading => !loading),
          take(1))
        .subscribe(_ => {
          this.pricings = this.pricingService.rentalPricings;
          this.isPricesLoading = false;
        });

      combineLatest(([this.districtService.isLoading$, this.homeService.homeTypesLoading$, this.valutaService.isLoading$]))
        .pipe(
          filter(([isDistrictLoading, isHomeTypesLoading, isValutaLoading]) => !isDistrictLoading && !isHomeTypesLoading && !isValutaLoading),
          take(1))
        .subscribe(_ => {
          this.valutas = this.valutaService.valueOptions;
          this.homeTypes = this.homeService.homeTypes;
          this.districts = this.districtService.districts;
          this.fetchHomes();
        })
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  fetchHomes(isScroll: boolean = false) {
    this.currentPageNo++;
    this.holidayHomeService.onApplyDetailedFilter(this.appliedFilter, this.districts, this.valutas, 10, this.currentPageNo)
      .pipe(take(1))
      .subscribe(homes => {
        if (isScroll) {
          this.homes = [...this.homes, ...homes];
        } else {
          this.homes = [...homes];
        }
        this.isLoading = false;
        setTimeout(() => {
          if (this.refresherEvent) {
            this.refresherEvent.target.complete();
            this.refresherEvent = null;
            this.isRefreshing=false;
          }
          if (this.event) {
            this.event.target.complete();
            if (homes.length === 0) {
              this.isScrollDisabled = true;
            }
            this.event = null as any;
          }
        }, 500);

      })

  }

  onResetFilter() {
    this.currentPageNo = 0;
    this.isLoading = true;
    this.event = null as any;
    this.appliedFilter = null as any;
    this.searchQuery = '';
    this.selectedDistrict = '';
    this.selectedPropertyType = '';
    this.selectedRentalPricing = '';
    this.currentPageNo = 0;
    this.fetchHomes();
  }

  onApplyFilter() {
    this.currentPageNo = 0;
    this.isLoading = true;

    this.appliedFilter = {};
    if (this.searchQuery && this.searchQuery.trim()) {
      this.appliedFilter.search = this.searchQuery.trim();
    }
    if (this.selectedPropertyType) {
      this.appliedFilter.type = this.selectedPropertyType;
    }
    if (this.selectedDistrict) {
      this.appliedFilter.district = this.selectedDistrict;
    }
    if (this.selectedRentalPricing) {
      this.appliedFilter.priceRange = this.selectedRentalPricing;
    }

    this.fetchHomes();

  }


  onIonInfinite(event: IonInfiniteScrollCustomEvent<void>) {
    this.event = event;
    this.fetchHomes(true);
  }

}
