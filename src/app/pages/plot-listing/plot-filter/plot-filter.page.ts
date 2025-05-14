import { Component, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonInput,IonSelect,IonSelectOption, IonCard, IonButton } from '@ionic/angular/standalone';
import { PlotFilter } from 'src/app/model/filter.model';
import { Pricing } from 'src/app/model/price.model';
import { LandArea } from 'src/app/model/area-model';
import { LandTitle } from 'src/app/model/land-title.model';
import { District } from 'src/app/model/districts.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-plot-filter',
  templateUrl: './plot-filter.page.html',
  styleUrls: ['./plot-filter.page.scss'],
  standalone: true,
  imports: [IonButton, IonCard, CommonModule, FormsModule,IonInput,IonSelect,IonSelectOption,TranslateModule]
})
export class PlotFilterPage implements OnInit {
    searchQuery = '';
    appliedFilter!: PlotFilter;
  selectedDistrict = '';
  selectedPlotArea = '';
  selectedLandTitle = '';
  selectedBuyPricing!: string;

  onApplyFilter=output<PlotFilter>();
  onResetFilter=output<void>();

  preFilter=input.required<PlotFilter>();
    pricings=input.required<Pricing[]>();
  landAreas=input.required<LandArea[]>();
  landTitles=input.required<LandTitle[]>();
  districts=input.required<District[]>();


  constructor() { }

  ngOnInit() {
    if(this.preFilter()){
      this.appliedFilter=this.preFilter();
      if(this.appliedFilter.district){
        this.selectedDistrict=this.appliedFilter.district;
      }if(this.appliedFilter.landTitle){
        this.selectedLandTitle=this.appliedFilter.landTitle;
      }if(this.appliedFilter.plotArea){
        this.selectedPlotArea=this.appliedFilter.plotArea;
      }if(this.appliedFilter.search){
        this.searchQuery=this.appliedFilter.search;
    }if(this.appliedFilter.priceRange){
      this.selectedBuyPricing=this.appliedFilter.priceRange;
      }
  }
}

  applyFilter(){
        this.appliedFilter = {};
        if (this.searchQuery && this.searchQuery.trim()) {
          this.appliedFilter.search = this.searchQuery.trim();
        }
        if (this.selectedPlotArea) {
          this.appliedFilter.plotArea = this.selectedPlotArea;
        }
        if(this.selectedBuyPricing){
          this.appliedFilter.priceRange = this.selectedBuyPricing;
        }
        if (this.selectedLandTitle) {
          this.appliedFilter.landTitle = this.selectedLandTitle;
        }
        if (this.selectedDistrict) {
          this.appliedFilter.district = this.selectedDistrict;
        }
    this.onApplyFilter.emit(this.appliedFilter);
  }

  resetFilter(){
    this.searchQuery = '';
    this.selectedBuyPricing = '';
    this.selectedDistrict = '';
    this.selectedPlotArea = '';
    this.appliedFilter=null as any;
    this.onResetFilter.emit();
  }

}
