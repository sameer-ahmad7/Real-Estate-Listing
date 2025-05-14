import { Component, input, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonSegment, IonButtons,
  IonButton, IonIcon, IonBackButton, IonInfiniteScroll, IonInfiniteScrollContent, ModalController, IonRefresher, IonRefresherContent, IonSegmentButton, IonRow, IonGrid, IonCol } from '@ionic/angular/standalone';
import { IonInfiniteScrollCustomEvent, IonRefresherCustomEvent, RefresherEventDetail } from '@ionic/core';
import { addIcons } from 'ionicons';
import { chevronBack, chevronDownCircleOutline, home, location, gridOutline, listOutline } from 'ionicons/icons';
import { combineLatest, filter, take } from 'rxjs';
import { District } from 'src/app/model/districts.model';
import { DataTypes, IFilter, PlotFilter } from 'src/app/model/filter.model';
import { DistrictService } from 'src/app/services/district.service';
import { PlotService } from 'src/app/services/plot.service';
import { Plot } from 'src/app/model/plot.model';
import { PlotViewComponent } from '../plot-view/plot-view.component';
import { Pricing } from 'src/app/model/price.model';
import { PricingService } from 'src/app/services/pricing.service';
import { BuildingArea, LandArea } from 'src/app/model/area-model';
import { AreaService } from 'src/app/services/area.service';
import { LandTitle } from 'src/app/model/land-title.model';
import { LandTitleService } from 'src/app/services/land-title.service';
import { ValutaOptions } from 'src/app/model/valuta-model';
import { ValutaService } from 'src/app/services/valuta.service';
import { PlotFilterPage } from "./plot-filter/plot-filter.page";
import { CustomSpinnerPage } from "../custom-spinner/custom-spinner.page";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-plot-listing',
  templateUrl: './plot-listing.page.html',
  styleUrls: ['./plot-listing.page.scss'],
  standalone: true,
  providers: [ModalController],
  imports: [IonCol, IonGrid, IonRow, IonSegmentButton, IonRefresherContent, IonRefresher,  IonInfiniteScrollContent, IonInfiniteScroll, PlotViewComponent,
    IonBackButton, IonIcon, IonButton, IonButtons,TranslateModule,IonSegment,
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, PlotFilterPage, CustomSpinnerPage]
})
export class PlotListingPage implements OnInit {

  isForSaleByOwner = input<boolean>();
  valutas: ValutaOptions[] = [];
  searchQuery = '';
  appliedFilter!: PlotFilter;
  pricings: Pricing[] = [];
  buyPricings: Pricing[] = [];

  landAreas: BuildingArea[] = [];
  landTitles: LandTitle[] = [];

  isPricesLoading = true;

  isRefreshing=false;

  plots: Plot[] = [];
  districts: District[] = [];
  currentPageNo = 0;


  isLoading = true;
  isModal = false;

  event?: IonInfiniteScrollCustomEvent<void>;
  isScrollDisabled = false;
  refresherEvent!: IonRefresherCustomEvent<RefresherEventDetail> | null;
  viewMode:'list'|'grid'='grid';


  constructor(private plotService: PlotService, private districtService: DistrictService, private valutaService: ValutaService,
    private pricingService: PricingService, private areaService: AreaService, private landTitleService: LandTitleService,
    private modalController: ModalController) {
    addIcons({chevronBack,gridOutline,listOutline,home,location,chevronDownCircleOutline});
  }

  ngOnInit() {

    if (!this.isModal) {
      this.pricingService.buyPriceLoading$
        .pipe(filter(buyLoading => !buyLoading))
        .subscribe(_ => {
          this.buyPricings = this.pricingService.buyPricings;
          this.pricings = this.buyPricings;
          this.isPricesLoading = false;
        });

      combineLatest(([this.districtService.isLoading$, this.areaService.buildingAreaLoading$, this.landTitleService.isLoading$, this.valutaService.isLoading$]))
        .pipe(
          filter(([isDistrictLoading, isPlotAreaLoading, isLandTitleLoading, valutaLoading]) => !isDistrictLoading && !isPlotAreaLoading && !isLandTitleLoading && !valutaLoading),
          take(1)
        )
        .subscribe(_ => {
          this.valutas = this.valutaService.valueOptions;
          this.landTitles = this.landTitleService.landTitles;
          this.districts = this.districtService.districts;
          this.landAreas = this.areaService.buildingArea;
          console.log(this.landAreas)
          this.fetchPlots();
        })
    } else {
      combineLatest(([this.districtService.isLoading$, this.valutaService.isLoading$]))
        .pipe(
          filter(([isDistrictLoading, isValutaLoading]) => !isDistrictLoading && !isValutaLoading),
          take(1)
        )
        .subscribe(_ => {
          this.valutas = this.valutaService.valueOptions;
          this.districts = this.districtService.districts;
          this.fetchPlots();
        })
    }

  }

  handleRefresh(event: IonRefresherCustomEvent<RefresherEventDetail>) {
    this.isLoading=true;
    this.isRefreshing=true;
    this.currentPageNo = 0;
    this.refresherEvent = event;
    this.fetchPlots();
  }


  dismiss() {
    this.modalController.dismiss();
  }

  fetchPlots(isScroll: boolean = false) {
    this.currentPageNo++;
    this.plotService.onApplyBuyPlotDetailedFilter(this.appliedFilter, this.districts, this.valutas, 10, this.currentPageNo, this.isForSaleByOwner() ? 1 : 0)
      .pipe(take(1))
      .subscribe(plots => {
        if (isScroll) {
          this.plots = [...this.plots, ...plots];
        } else {
          this.plots = [...plots];
        }
        this.isLoading = false;
        setTimeout(() => {
          if (this.refresherEvent) {
            this.refresherEvent.target.complete();
            this.refresherEvent = null;
          }

          if (this.event) {
            this.event.target.complete();
            if (plots.length === 0) {
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
    this.currentPageNo = 0;
    this.fetchPlots();
  }

  onApplyFilter(event: PlotFilter) {
    this.currentPageNo = 0;
    this.isLoading = true;
    this.appliedFilter = event;

    this.fetchPlots();

  }

  onIonInfinite(event: IonInfiniteScrollCustomEvent<void>) {
    this.event = event;
    this.fetchPlots(true);
  }

}
