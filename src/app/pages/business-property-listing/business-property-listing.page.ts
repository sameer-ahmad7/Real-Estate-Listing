import { Component, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonProgressBar, IonButtons, IonButton, IonSelect, IonSelectOption,
  IonSegment, ModalController,
  IonBackButton, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonCard, IonSpinner, IonRefresher, IonRefresherContent, IonSegmentButton, IonGrid, IonCol, IonRow } from '@ionic/angular/standalone';
import { BusinessProperty, BusinessType } from 'src/app/model/business-property.model';
import { BusinessPropertyService } from 'src/app/services/business-property.service';
import { addIcons } from 'ionicons';
import { IonInfiniteScrollCustomEvent, IonRefresherCustomEvent, IonSelectCustomEvent, RefresherEventDetail, SelectChangeEventDetail } from '@ionic/core';
import { chevronBack, chevronDownCircleOutline, home, location, gridOutline, listOutline } from 'ionicons/icons';
import { combineLatest, filter, take } from 'rxjs';
import { District } from 'src/app/model/districts.model';
import { BusinessPropertyFilter, DataTypes, IFilter } from 'src/app/model/filter.model';
import { DistrictService } from 'src/app/services/district.service';
import { BusinessPropertyViewComponent } from '../business-property-view/business-property-view.component';
import { ActivatedRoute } from '@angular/router';
import { Pricing } from 'src/app/model/price.model';
import { LandArea, BuildingArea } from 'src/app/model/area-model';
import { AreaService } from 'src/app/services/area.service';
import { PricingService } from 'src/app/services/pricing.service';
import { LandTitle } from 'src/app/model/land-title.model';
import { LandTitleService } from 'src/app/services/land-title.service';
import { ValutaOptions } from 'src/app/model/valuta-model';
import { ValutaService } from 'src/app/services/valuta.service';
import { BusinessPropertyFilterPage } from "./business-property-filter/business-property-filter.page";
import { CustomSpinnerPage } from "../custom-spinner/custom-spinner.page";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-business-property-listing',
  templateUrl: './business-property-listing.page.html',
  styleUrls: ['./business-property-listing.page.scss'],
  standalone: true,
  providers: [ModalController],
  imports: [IonRow, IonCol, IonGrid, IonSegmentButton, IonRefresherContent, IonRefresher,  IonInfiniteScrollContent, IonInfiniteScroll, IonIcon, IonBackButton, IonButton, BusinessPropertyViewComponent,
    IonButtons, IonContent, IonHeader, IonTitle,TranslateModule,    IonSegment,IonSegmentButton,

    IonToolbar, CommonModule, FormsModule, BusinessPropertyFilterPage, CustomSpinnerPage]
})
export class BusinessPropertyListingPage implements OnInit {

  isForSaleByOwner = input<boolean>();
  isForRental = input<boolean>();
  isChildComponent = input<boolean>();



  appliedFilter!: BusinessPropertyFilter;

  pricings: Pricing[] = [];
  buyPricings: Pricing[] = [];
  rentalPricings: Pricing[] = [];
  landTitles: LandTitle[] = [];


  isPricesLoading = true;


  plotAreas:BuildingArea[]=[];
  constructionAreas:LandArea[]=[];

  isRefreshing=false;


  businessTypes:BusinessType[]=[];

  businessProperties: BusinessProperty[] = [];
  districts: District[] = [];
  currentPageNo = 0;


  isLoading = true;
  isModal = false;
  isRental = false;

  event?: IonInfiniteScrollCustomEvent<void>;
  isScrollDisabled = false;
  valutas: ValutaOptions[] = [];
  refresherEvent!: IonRefresherCustomEvent<RefresherEventDetail> | null;
  viewMode:'list'|'grid'='grid';



  constructor(private businessPropertyService: BusinessPropertyService, private valutaService: ValutaService,
    private route: ActivatedRoute, private landTitleService: LandTitleService,
    private areaService: AreaService, private pricingService: PricingService,
    private districtService: DistrictService,
    private modalController: ModalController) {
    addIcons({chevronBack,gridOutline,listOutline,home,location,chevronDownCircleOutline});
  }

  ngOnInit() {

    if (this.isModal) {
      this.fetchData();
    }
    else if (this.isChildComponent()) {
      if (this.isForRental()) {
        this.isRental = true;
      }

      this.fetchData();
    }
    else {
      this.route.url.
        pipe(take(1))
        .subscribe(segments => {
          const routePath = segments.map(segment => segment.path).join('/');
          if (routePath === 'business-properties/rental') {
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
    this.fetchProperties();
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
          this.fetchProperties();
        })
    } else {
      combineLatest(([this.pricingService.buyPriceLoading$, this.pricingService.rentalPriceLoading$, this.landTitleService.isLoading$, this.valutaService.isLoading$,this.businessPropertyService.businessTypesLoading$]))
        .pipe(filter(([buyLoading, rentalLoading, landTitleLoading, valutaLoading,businessTypesLoading]) => !buyLoading && !rentalLoading && !landTitleLoading && !valutaLoading && !businessTypesLoading ),
          take(1))
        .subscribe(_ => {
          this.businessTypes=this.businessPropertyService.businessTypes;
          this.valutas = this.valutaService.valueOptions;
          this.landTitles = this.landTitleService.landTitles;
          this.buyPricings = this.pricingService.buyPricings;
          this.rentalPricings = this.pricingService.rentalPricings;
          if (this.isRental) {
            this.pricings = this.rentalPricings;
          } else {
            this.pricings = this.buyPricings;
          }
          this.isPricesLoading = false;
        });

      combineLatest([this.districtService.isLoading$, this.areaService.buildingAreaLoading$,this.areaService.plotAreaLoading$])
        .pipe(
          filter(([isDistrictLoading, isPlotAreaLoading, isBuildingAreaLoading]) => !isDistrictLoading && !isPlotAreaLoading && !isBuildingAreaLoading),
          take(1)
        )
        .subscribe(_ => {
          this.districts = this.districtService.districts;
          this.plotAreas=this.areaService.buildingArea;
          this.constructionAreas=this.areaService.plotArea;
          this.fetchProperties();
        })
    }

  }



  dismiss() {
    this.modalController.dismiss();
  }

  fetchProperties(isScroll: boolean = false) {
    this.currentPageNo++;
    if (this.isRental) {
      this.businessPropertyService.onApplyRentPropertyDetailedFilter(this.appliedFilter, this.districts, this.valutas, 10, this.currentPageNo, this.isForSaleByOwner() ? 1 : 0)
        .pipe(take(1))
        .subscribe(properties => {
          if (isScroll) {
            this.businessProperties = [...this.businessProperties, ...properties];
          } else {
            this.businessProperties = [...properties];
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
              if (properties.length === 0) {
                this.isScrollDisabled = true;
              }
              this.event = null as any;
            }
          }, 500);

        })
    } else {
      this.businessPropertyService.onApplyBuyPropertyDetailedFilter(this.appliedFilter, this.districts, this.valutas, 10, this.currentPageNo, this.isForSaleByOwner() ? 1 : 0)
        .pipe(take(1))
        .subscribe(properties => {
          if (isScroll) {
            this.businessProperties = [...this.businessProperties, ...properties];
          } else {
            this.businessProperties = [...properties];
          }
          this.isLoading = false;
          setTimeout(() => {
            if (this.refresherEvent) {
              this.refresherEvent.target.complete();
              this.refresherEvent = null;
            }
            if (this.event) {
              this.event.target.complete();
              if (properties.length === 0) {
                this.isScrollDisabled = true;
              }
              this.event = null as any;
            }
          }, 500);
        })
    }
  }

  onResetFilter() {
    this.currentPageNo = 0;
    this.isLoading = true;
    this.event = null as any;
    this.appliedFilter = null as any;
    this.currentPageNo = 0;
    this.fetchProperties();
  }

  onApplyFilter(event: BusinessPropertyFilter) {
    this.currentPageNo = 0;
    this.isLoading = true;
    this.appliedFilter = event;

    this.fetchProperties();

  }

  onIonInfinite(event: IonInfiniteScrollCustomEvent<void>) {
    this.event = event;
    this.fetchProperties(true);
  }

}
