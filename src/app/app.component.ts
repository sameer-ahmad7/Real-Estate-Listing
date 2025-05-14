import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SafeArea } from '@capacitor-community/safe-area';
import { DistrictService } from './services/district.service';
import { HomeService } from './services/home.service';
import { PricingService } from './services/pricing.service';
import { AreaService } from './services/area.service';
import { LandTitleService } from './services/land-title.service';
import { BusinessPropertyService } from './services/business-property.service';
import { ValutaService } from './services/valuta.service';
import { NotificationService } from './services/notification.service';
import { Capacitor } from '@capacitor/core';
import {SplashScreen} from '@capacitor/splash-screen';
import { LanguageService } from './services/language.service';

SafeArea.enable({
  config: {
    statusBarColor: '#fafbfa',
    statusBarContent: 'dark',
    navigationBarColor: '#fafbfa',
    navigationBarContent: 'dark'

  }
});


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})

export class AppComponent {

  constructor(private districtService: DistrictService, private pricingService: PricingService, private valueService: ValutaService,
    private landTitleService: LandTitleService, private businessService: BusinessPropertyService,
    private homeService: HomeService, private areaService: AreaService,private languageService:LanguageService) { }

  async ngOnInit() {
    this.initApp();
  }

  initApp() {
    this.valueService.getValueOptions();
    this.businessService.getBusinessTypes();
    this.landTitleService.getLandTitles();
    this.homeService.getHomeTypes();
    this.pricingService.getBuyPrices();
    this.pricingService.getRentalPricings();
    this.districtService.getDistricts();
    this.areaService.getBuildingArea();
    this.areaService.getLandArea();
  }
}
