import { Component, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {  IonCard, IonButton,
IonInput,IonSelect,IonSelectOption,

 } from '@ionic/angular/standalone';
import { BusinessPropertyFilter } from 'src/app/model/filter.model';
import { Pricing } from 'src/app/model/price.model';
import { LandTitle } from 'src/app/model/land-title.model';
import { LandArea, BuildingArea } from 'src/app/model/area-model';
import { District } from 'src/app/model/districts.model';
import { IonSelectCustomEvent, SelectChangeEventDetail } from '@ionic/core';
import { BusinessType } from 'src/app/model/business-property.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-business-property-filter',
  templateUrl: './business-property-filter.page.html',
  styleUrls: ['./business-property-filter.page.scss'],
  standalone: true,
  imports: [IonButton, IonCard, IonInput, IonSelect,IonSelectOption,CommonModule,TranslateModule, FormsModule]
})
export class BusinessPropertyFilterPage implements OnInit {
  searchQuery = '';
  selectedDistrict = '';
  selectedPlotArea = '';
  selectedConstructionArea = '';
  selectedLandTitle = '';
  selectedBuyPricing!: string;
  selectedRentalPricing!: string;
  selectedPropertyType = '';

  appliedFilter!: BusinessPropertyFilter;

  onApplyFilter=output<BusinessPropertyFilter>();
  onResetFilter=output<void>();

  businessTypes=input.required<BusinessType[]>();
  preFilter=input.required<BusinessPropertyFilter>();
  isRental=input.required<boolean>();
  pricings=input.required<Pricing[]>();
    landTitles=input.required<LandTitle[]>();
  plotAreas=input.required<LandArea[]>();
  constructionAreas=input.required<BuildingArea[]>();
  districts=input.required<District[]>();



  constructor() { }

  ngOnInit() {
    if(this.preFilter()){
      this.searchQuery = this.preFilter().search || '';
      if(this.isRental()){
        this.selectedRentalPricing = this.preFilter().priceRange || '';
      }else{
        this.selectedBuyPricing = this.preFilter().priceRange || '';
      }
      if(this.preFilter().propertyType){
      this.selectedPropertyType = this.preFilter().propertyType || '';
      }
      this.selectedDistrict = this.preFilter().district || '';
      this.selectedConstructionArea = this.preFilter().constructionArea || '';
      this.selectedPlotArea = this.preFilter().plotArea || '';
      this.selectedLandTitle = this.preFilter().landTitle || '';
      this.appliedFilter=this.preFilter();
    }
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
    if (this.selectedConstructionArea) {
      this.appliedFilter.constructionArea = this.selectedConstructionArea;
    }
    if (this.selectedLandTitle) {
      this.appliedFilter.landTitle = this.selectedLandTitle;
    }
    if(this.selectedPropertyType){
      this.appliedFilter.propertyType=this.selectedPropertyType;
    }
    if (this.selectedPlotArea) {
      this.appliedFilter.plotArea = this.selectedPlotArea;
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
    this.appliedFilter=null as any;
    this.searchQuery = '';
    this.selectedConstructionArea = '';
    this.selectedBuyPricing = '';
    this.selectedDistrict = '';
    this.selectedPlotArea = '';
    this.selectedPropertyType = '';
    this.selectedRentalPricing = '';
    this.onResetFilter.emit();

  }

}
