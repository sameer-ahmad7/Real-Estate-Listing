import { Component, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  IonCard ,IonInput,IonSelect,IonSelectOption,IonButton} from '@ionic/angular/standalone';
import { HomeTypes } from 'src/app/model/home.model';
import { District } from 'src/app/model/districts.model';
import { BuildingArea, LandArea } from 'src/app/model/area-model';
import { LandTitle } from 'src/app/model/land-title.model';
import { Pricing } from 'src/app/model/price.model';
import { HouseFilter } from 'src/app/model/filter.model';
import { IonSelectCustomEvent, SelectChangeEventDetail } from '@ionic/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home-filter',
  templateUrl: './home-filter.page.html',
  styleUrls: ['./home-filter.page.scss'],
  standalone: true,
  imports: [IonCard,IonInput,IonSelect,IonSelectOption,IonButton,TranslateModule,  CommonModule, FormsModule]
})
export class HomeFilterPage implements OnInit {
  selectedDistrict = '';
  selectedPlotArea = '';
  selectedLandTitle = '';
  searchQuery='';
  selectedBuyPricing!: string;
  selectedRentalPricing!: string;
  appliedFilter!: HouseFilter;
  selectedPropertyType = '';
  selectedConstructionArea='';


  preFilter=input.required<HouseFilter>();

  onResetFilter=output<void>();
  onApplyFilter=output<HouseFilter>();
  homeTypes=input.required<HomeTypes[]>();
  districts=input.required<District[]>();
  isRental=input.required<boolean>();
  constructionAreas=input.required<LandArea[]>();
  plotAreas=input.required<BuildingArea[]>();
  landTitles=input.required<LandTitle[]>();
  pricings=input.required<Pricing[]>();

  constructor() { }

  ngOnInit() {
    console.log(this.preFilter());
    if(this.preFilter()){
      this.searchQuery = this.preFilter().search || '';
      if(this.isRental()){
        this.selectedRentalPricing = this.preFilter().priceRange || '';
      }else{
        this.selectedBuyPricing = this.preFilter().priceRange || '';
      }
      this.selectedPropertyType = this.preFilter().type || '';
      this.selectedDistrict = this.preFilter().district || '';
      this.selectedConstructionArea = this.preFilter().constructionArea || '';
      this.selectedPlotArea = this.preFilter().plotArea || '';
      this.selectedLandTitle = this.preFilter().landTitle || '';
      this.appliedFilter=this.preFilter();
    }
  }

    onDistrictChanged(event: IonSelectCustomEvent<SelectChangeEventDetail<any>>) {
      this.selectedDistrict = event.target.value;
    }


    onPropertyTypeChanged(event: IonSelectCustomEvent<SelectChangeEventDetail<any>>) {
      this.selectedPropertyType = event.target.value;
    }

    onPriceChanged(event: IonSelectCustomEvent<SelectChangeEventDetail<any>>) {
      if (!this.isRental()) {
        this.selectedBuyPricing = event.target.value;

      } else {
        this.selectedRentalPricing = event.target.value;

      }
    }


  applyFilter(){

        this.appliedFilter = {};
        if (this.searchQuery && this.searchQuery.trim()) {
          this.appliedFilter.search = this.searchQuery.trim();
        }
        if (this.selectedLandTitle) {
          this.appliedFilter.landTitle = this.selectedLandTitle;
        }
        if (this.selectedPlotArea) {
          this.appliedFilter.plotArea = this.selectedPlotArea;
        }
        if (this.selectedConstructionArea) {
          this.appliedFilter.constructionArea = this.selectedConstructionArea;
        }
        if (this.selectedPropertyType) {
          this.appliedFilter.type = this.selectedPropertyType;
        }
        if (this.selectedDistrict) {
          this.appliedFilter.district = this.selectedDistrict;
        }
        if (this.isRental()) {
          if (this.selectedRentalPricing) {
            this.appliedFilter.priceRange = this.selectedRentalPricing;
          }
        } else {
          if (this.selectedBuyPricing) {
            this.appliedFilter.priceRange = this.selectedBuyPricing;
          }
        }
        this.onApplyFilter.emit(this.appliedFilter);

  }

  resetFilter(){
    this.searchQuery = '';
    this.selectedConstructionArea = '';
    this.selectedBuyPricing = '';
    this.selectedDistrict = '';
    this.selectedPlotArea = '';
    this.selectedPropertyType = '';
    this.selectedRentalPricing = '';
    this.appliedFilter=null as any;
this.onResetFilter.emit();
  }

}
