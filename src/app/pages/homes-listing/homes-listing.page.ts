import { Component, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonInput,IonSegment,
  IonButton, IonIcon, IonBackButton, IonSelect, IonProgressBar, IonInfiniteScroll,
  IonInfiniteScrollContent, IonCard, IonSelectOption, ModalController, IonSpinner, IonRefresher, IonRefresherContent, IonSegmentButton, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { Home, HomeTypes } from 'src/app/model/home.model';
import { District } from 'src/app/model/districts.model';
import { HomeService } from 'src/app/services/home.service';
import { addIcons } from 'ionicons';
import { home, location, chevronBack, chevronDownCircleOutline, listOutline, mapOutline, gridOutline } from 'ionicons/icons';
import { DistrictService } from 'src/app/services/district.service';
import { combineLatest, filter, take } from 'rxjs';
import { IonInfiniteScrollCustomEvent, IonRefresherCustomEvent, IonSelectCustomEvent, RefresherEventDetail, SelectChangeEventDetail } from '@ionic/core';
import { HomeViewComponent } from '../home-view/home-view.component';
import { HouseFilter } from 'src/app/model/filter.model';
import { ActivatedRoute } from '@angular/router';
import { AreaService } from 'src/app/services/area.service';
import { BuildingArea, LandArea } from 'src/app/model/area-model';
import { PricingService } from 'src/app/services/pricing.service';
import { Pricing } from 'src/app/model/price.model';
import { LandTitle } from 'src/app/model/land-title.model';
import { LandTitleService } from 'src/app/services/land-title.service';
import { ValutaService } from 'src/app/services/valuta.service';
import { ValutaOptions } from 'src/app/model/valuta-model';
import { HomeFilterPage } from './home-filter/home-filter.page';
import { CustomSpinnerPage } from "../custom-spinner/custom-spinner.page";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-homes-listing',
  templateUrl: './homes-listing.page.html',
  styleUrls: ['./homes-listing.page.scss'],
  standalone: true,
  providers: [ModalController],
  imports: [IonCol, IonRow, IonGrid, IonSegmentButton, IonRefresherContent, IonRefresher, IonInfiniteScrollContent, IonInfiniteScroll,  HomeFilterPage,
    IonBackButton, IonIcon, IonButton, IonButtons, IonContent, IonHeader,TranslateModule,IonSegment,
    IonTitle, IonToolbar, CommonModule, FormsModule, HomeViewComponent, CustomSpinnerPage]
})
export class HomesListingPage implements OnInit {
  refresherEvent!: IonRefresherCustomEvent<RefresherEventDetail> | null;

  isForSaleByOwner = input<boolean>();
  isForRental = input<boolean>();
  isChildComponent = input<boolean>();
  plotAreas:BuildingArea[]=[];
  constructionAreas:LandArea[]=[];

  homes: Home[] = [];
  districts: District[] = [];
  currentPageNo = 0;

  appliedFilter!: HouseFilter;

  pricings: Pricing[] = [];
  buyPricings: Pricing[] = [];
  rentalPricings: Pricing[] = [];
  landTitles: LandTitle[] = [];

  isRefreshing=false;


  homeTypes: HomeTypes[] = [];
  isLoading = true;
  isModal = false;
  isRental = false;
  isPricesLoading = true;


  event?: IonInfiniteScrollCustomEvent<void>;
  isScrollDisabled = false;

  landAreas: LandArea[] = [];
  buildingAreas: BuildingArea[] = [];
  valutas: ValutaOptions[] = [];
  viewMode:'list'|'grid'='grid';


  constructor(private homeService: HomeService, private districtService: DistrictService, private valutaService: ValutaService,
    private areaService: AreaService, private pricingService: PricingService, private landTitleService: LandTitleService,
    private modalController: ModalController, private route: ActivatedRoute) {
    addIcons({chevronBack,listOutline,home,location,chevronDownCircleOutline,gridOutline});
  }

  ngOnInit() {


    if (this.isModal) {
      this.fetchData();
    } else if (this.isChildComponent()) {
      if (this.isForRental()) {
        this.isRental = true;
      }

      this.fetchData();
    }
    else {
      this.route.url
        .pipe(take(1))
        .subscribe(segments => {
          const routePath = segments.map(segment => segment.path).join('/');
          if (routePath === 'houses/rental') {
            this.isRental = true;
          } else {
            this.isRental = false;
          }
          this.fetchData();
        });
    }

  }

  handleRefresh(event: IonRefresherCustomEvent<RefresherEventDetail>) {
    this.isLoading=true;
    this.isRefreshing=true;
    this.currentPageNo = 0;
    this.refresherEvent = event;
    this.fetchHomes();
  }


  onResetFilter() {
    this.currentPageNo = 0;
    this.isLoading = true;
    this.event = null as any;
    this.appliedFilter = null as any;
    this.fetchHomes();
  }

  onApplyFilter(event: HouseFilter) {
    console.log(event)
    this.appliedFilter = event;
    this.currentPageNo = 0;
    this.isLoading = true;
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
      combineLatest(([this.pricingService.buyPriceLoading$, this.pricingService.rentalPriceLoading$, this.valutaService.isLoading$,this.areaService.buildingAreaLoading$,this.areaService.plotAreaLoading$]))
        .pipe(filter(([buyLoading, rentalLoading, valutaLoading,buildingAreaLoading,plotAreaLoading]) => !buyLoading && !rentalLoading && !valutaLoading && !buildingAreaLoading && !plotAreaLoading),
          take(1)
        )
        .subscribe(_ => {
          this.plotAreas=this.areaService.buildingArea;
          this.constructionAreas=this.areaService.plotArea;
          console.log(this.plotAreas);
          console.log(this.constructionAreas);
          this.valutas = this.valutaService.valueOptions;
          this.buyPricings = this.pricingService.buyPricings;
          this.rentalPricings = this.pricingService.rentalPricings;
          if (this.isRental) {
            this.pricings = this.rentalPricings;
          } else {
            this.pricings = this.buyPricings;
          }
          this.isPricesLoading = false;
        });

      combineLatest(([this.districtService.isLoading$, this.areaService.plotAreaLoading$, this.areaService.buildingAreaLoading$, this.homeService.homeTypesLoading$, this.landTitleService.isLoading$]))
        .pipe(
          filter(([isDistrictLoading, isPlotAreaLoading, isBuildingAreaLoading, isHomeTypesLoading, isLandTitleLoading]) => !isDistrictLoading && !isPlotAreaLoading && !isBuildingAreaLoading && !isHomeTypesLoading && !isLandTitleLoading),
          take(1)
        )
        .subscribe(_ => {
          this.landTitles = this.landTitleService.landTitles;
          this.homeTypes = this.homeService.homeTypes;
          this.districts = this.districtService.districts;
          this.buildingAreas = this.areaService.buildingArea;
          this.landAreas = this.areaService.plotArea;
          this.fetchHomes();
        })
    }

  }




  dismiss() {
    this.modalController.dismiss();
  }

  fetchHomes(isScroll: boolean = false) {
    this.currentPageNo++;
    if (this.isRental) {
      this.homeService.onApplyRentHomeDetailedFilter(this.appliedFilter, this.districts, this.valutas, 10, this.currentPageNo, this.isForSaleByOwner() ? 1 : 0)
        .pipe(take(1))
        .subscribe(homes => {
          if (isScroll) {
            this.homes = [...this.homes, ...homes];

          }
          else {
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
    } else {
      this.homeService.onApplyBuyHomeDetailedFilter(this.appliedFilter, this.districts, this.valutas, 10, this.currentPageNo, this.isForSaleByOwner() ? 1 : 0)
        .pipe(take(1))
        .subscribe(homes => {
          if (isScroll) {
            this.homes = [...this.homes, ...homes];

          }
          else {
            console.log(homes);
            this.homes = [...homes];
          }
          this.isLoading = false;
          setTimeout(() => {
            if (this.refresherEvent) {
              this.refresherEvent.target.complete();
              if (this.refresherEvent) {
                this.refresherEvent.target.complete();
                this.refresherEvent = null;
              }
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
  }

  onIonInfinite(event: IonInfiniteScrollCustomEvent<void>) {
    this.event = event;
    this.fetchHomes(true);
  }


}
