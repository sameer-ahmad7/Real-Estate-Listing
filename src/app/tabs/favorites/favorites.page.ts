import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonChip, IonButton, PopoverController, IonSegmentButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBack, gridOutline, listOutline } from 'ionicons/icons';
import { Favorite, ListingType } from 'src/app/model/favorite.model';
import { FavoriteService } from 'src/app/services/favorite.service';
import { HomeService } from 'src/app/services/home.service';
import { PlotService } from 'src/app/services/plot.service';
import { BusinessPropertyService } from 'src/app/services/business-property.service';
import { HolidayHomeService } from 'src/app/services/holiday-home.service';
import { combineLatest, filter, Observable, take } from 'rxjs';
import { Home } from 'src/app/model/home.model';
import { DistrictService } from 'src/app/services/district.service';
import { District } from 'src/app/model/districts.model';
import { ValutaOptions } from 'src/app/model/valuta-model';
import { ValutaService } from 'src/app/services/valuta.service';
import { BusinessProperty } from 'src/app/model/business-property.model';
import { Plot } from 'src/app/model/plot.model';
import { HolidayHome } from 'src/app/model/holiday-home.model';
import { BusinessPropertyViewComponent } from 'src/app/pages/business-property-view/business-property-view.component';
import { HomeViewComponent } from "../../pages/home-view/home-view.component";
import { PlotViewComponent } from "../../pages/plot-view/plot-view.component";
import { HolidayHomeViewComponent } from "../../pages/holiday-home-view/holiday-home-view.component";
import { CustomSpinnerPage } from "../../pages/custom-spinner/custom-spinner.page";
import { TranslateModule } from '@ngx-translate/core';
import { LanguageMenuPage } from "../../shared/language-menu/language-menu.page";
import { LanguageService } from 'src/app/services/language.service';

interface Segment {
  title: string; listType: ListingType
}

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [IonIcon, IonSegmentButton, IonButton,  IonChip, IonContent, IonHeader, BusinessPropertyViewComponent, TranslateModule,
    IonTitle, IonToolbar, CommonModule, FormsModule, HomeViewComponent, IonButtons,
    PlotViewComponent, HolidayHomeViewComponent, CustomSpinnerPage, LanguageMenuPage]
})
export class FavoritesPage implements OnInit {

  languages$=this.languageService.language$;
  isPostsLoading = true;
  isLoading = true;
  selectedSegment: Segment = { title: 'FAVORITES.PropertiesforSale', listType: ListingType.HOME };
  segmentOptions: Segment[] = [
    { title: 'FAVORITES.PropertiesforSale', listType: ListingType.HOME },
    { title: 'FAVORITES.Plots', listType: ListingType.PLOT },
    { title: 'FAVORITES.PropertiesforRent', listType: ListingType.RENTALHOME },
    { title: 'FAVORITES.VacationRentals', listType: ListingType.VACATIONRENTALS },
    { title: 'FAVORITES.Business_Properties_for_Sale', listType: ListingType.BUSINESSPROPERTY },
    { title: 'FAVORITES.Business_Properties_for_Rent', listType: ListingType.RENTALBUSINESSPROPERTY }
  ]

  favorites: Favorite[] = [];
  districts: District[] = [];
  valutas: ValutaOptions[] = [];
  homes: Home[] = [];
  rentalHomes: Home[] = [];
  businesses: BusinessProperty[] = [];
  rentalBusinesses: BusinessProperty[] = [];
  plots: Plot[] = [];
  properties: HolidayHome[] = [];
  get listTypeEnum() {
    return ListingType;
  }
  viewMode:'list'|'grid'='grid';


  constructor(private favoriteService: FavoriteService, private homeService: HomeService,
     private plotService: PlotService,private languageService: LanguageService,private popoverCtrl: PopoverController,
    private businessPropertyService: BusinessPropertyService, private vacationRentalService: HolidayHomeService,
    private districtService: DistrictService, private valutaService: ValutaService
  ) {
    addIcons({gridOutline,listOutline,chevronBack});
  }

  onSelectSegment(segment: Segment) {
    if (this.isLoading) {
      return;
    }
    this.selectedSegment = segment;
    this.fetchListings();
  }

  async ngOnInit() {
    this.fetchData();
  }

  async openLanguageMenu(ev: any) {
    const popover=await  this.popoverCtrl.create({
        component: LanguageMenuPage,
        event: ev,
    });
    await popover.present();
  }


  async fetchData() {
    await this.fetchFavorites();
    combineLatest(([this.districtService.isLoading$, this.valutaService.isLoading$]))
      .pipe(filter(([isDistrictLoading, isValutaLoading]) => !isDistrictLoading && !isValutaLoading),
        take(1)
      )
      .subscribe(_ => {
        this.districts = this.districtService.districts;
        this.valutas = this.valutaService.valueOptions;
        this.fetchListings();
      })

  }

  async fetchFavorites() {
    this.favorites = await this.favoriteService.getFavorites();
  }

  fetchListings() {
    this.isLoading = true;
    if (this.selectedSegment.listType === ListingType.HOME) {
      const filteredHomes = this.favorites.filter(f => f.type === ListingType.HOME);
      const homeIds = filteredHomes.map(f => f.id);
      if (homeIds.length > 0) {
        const homes$: Observable<Home>[] = [];
        for (const id of homeIds) {
          homes$.push(this.homeService.getPropertyById(id, this.districts, this.valutas, false));
        }
        combineLatest(homes$).pipe(take(1)).subscribe(homes => {
          this.homes = homes;
          this.isLoading = false;
          this.isPostsLoading = false;
        })
      } else {
        this.isLoading = false;
      }
    } else if (this.selectedSegment.listType === ListingType.RENTALHOME) {
      const filteredHomes = this.favorites.filter(f => f.type === ListingType.RENTALHOME);
      const homeIds = filteredHomes.map(f => f.id);
      if (homeIds.length > 0) {
        const homes$: Observable<Home>[] = [];
        for (const id of homeIds) {
          homes$.push(this.homeService.getPropertyById(id, this.districts, this.valutas, true));
        }
        combineLatest(homes$).pipe(take(1)).subscribe(homes => {
          this.rentalHomes = homes;
          this.isLoading = false;
          this.isPostsLoading = false;
        })
      } else {
        this.isLoading = false;
      }
    } else if (this.selectedSegment.listType === ListingType.BUSINESSPROPERTY) {
      const filteredBusinesses = this.favorites.filter(f => f.type === ListingType.BUSINESSPROPERTY);
      const businessIds = filteredBusinesses.map(f => f.id);
      if (businessIds.length > 0) {
        const businesses$: Observable<BusinessProperty>[] = [];
        for (const id of businessIds) {
          businesses$.push(this.businessPropertyService.getPropertyById(id, this.districts, this.valutas, false));
        }
        combineLatest(businesses$).pipe(take(1)).subscribe(businesses => {
          this.businesses = businesses;
          this.isLoading = false;
          this.isPostsLoading = false;
        })
      } else {
        this.isLoading = false;
      }
    } else if (this.selectedSegment.listType === ListingType.RENTALBUSINESSPROPERTY) {
      const filteredBusinesses = this.favorites.filter(f => f.type === ListingType.RENTALBUSINESSPROPERTY);
      const businessIds = filteredBusinesses.map(f => f.id);
      if (businessIds.length > 0) {
        const businesses$: Observable<BusinessProperty>[] = [];
        for (const id of businessIds) {
          businesses$.push(this.businessPropertyService.getPropertyById(id, this.districts, this.valutas, true));
        }
        combineLatest(businesses$).pipe(take(1)).subscribe(businesses => {
          this.rentalBusinesses = businesses;
          this.isLoading = false;
          this.isPostsLoading = false;
        })
      } else {
        this.isLoading = false;
      }
    } else if (this.selectedSegment.listType === ListingType.PLOT) {
      const filteredPlots = this.favorites.filter(f => f.type === ListingType.PLOT);
      const plotIds = filteredPlots.map(f => f.id);
      if (plotIds.length > 0) {
        const plots$: Observable<Plot>[] = [];
        for (const id of plotIds) {
          plots$.push(this.plotService.getPlotById(id, this.districts, this.valutas));
        }
        combineLatest(plots$).pipe(take(1)).subscribe(plots => {
          this.plots = plots;
          this.isLoading = false;
          this.isPostsLoading = false;
        })
      } else {
        this.isLoading = false;
      }
    } else if (this.selectedSegment.listType === ListingType.VACATIONRENTALS) {
      const filteredProperties = this.favorites.filter(f => f.type === ListingType.VACATIONRENTALS);
      const propertyIds = filteredProperties.map(f => f.id);
      if (propertyIds.length > 0) {
        const properties$: Observable<HolidayHome>[] = [];
        for (const id of propertyIds) {
          properties$.push(this.vacationRentalService.getHomeById(id, this.districts, this.valutas));
        }
        combineLatest(properties$).pipe(take(1)).subscribe(properties => {
          this.properties = properties;
          this.isLoading = false;
          this.isPostsLoading = false;
        })
      } else {
        this.isLoading = false;
      }
    }
  }

}
