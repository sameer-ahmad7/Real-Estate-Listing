import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,
   IonIcon, IonCard, IonChip,  IonBackButton, IonButtons, PopoverController, IonPopover } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { AgentService } from 'src/app/services/agent.service';
import { AgentInfo } from 'src/app/model/agent-model';
import { SecureUrlPipe } from "../../pipes/secure-url.pipe";
import { ListingType } from 'src/app/model/favorite.model';
import { Home } from 'src/app/model/home.model';
import { BusinessProperty } from 'src/app/model/business-property.model';
import { Plot } from 'src/app/model/plot.model';
import { HolidayHome } from 'src/app/model/holiday-home.model';
import { DistrictService } from 'src/app/services/district.service';
import { ValutaService } from 'src/app/services/valuta.service';
import { District } from 'src/app/model/districts.model';
import { ValutaOptions } from 'src/app/model/valuta-model';
import { combineLatest, filter } from 'rxjs';
import { HomeViewComponent } from "../home-view/home-view.component";
import { PlotViewComponent } from "../plot-view/plot-view.component";
import { BusinessPropertyViewComponent } from "../business-property-view/business-property-view.component";
import { HolidayHomeViewComponent } from "../holiday-home-view/holiday-home-view.component";
import { addIcons } from 'ionicons';
import { chevronBack } from 'ionicons/icons';
import { CustomSpinnerPage } from "../custom-spinner/custom-spinner.page";
import { TranslateModule } from '@ngx-translate/core';
import { PhoneContactComponent } from "../../shared/phone-contact/phone-contact.component";

interface Segment {
  title: string; listType: ListingType
}


@Component({
  selector: 'app-agent-details',
  templateUrl: './agent-details.page.html',
  styleUrls: ['./agent-details.page.scss'],
  standalone: true,
  imports: [IonPopover, IonButtons, IonBackButton, IonChip, IonCard, IonIcon, IonContent, TranslateModule,
    IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, SecureUrlPipe,PhoneContactComponent,
    HomeViewComponent, PlotViewComponent, BusinessPropertyViewComponent, HolidayHomeViewComponent, CustomSpinnerPage]
})
export class AgentDetailsPage implements OnInit {

  id=0;
  isLoading=true;
  agent!:AgentInfo;
    selectedSegment: Segment = { title: 'AGENT.PropertiesforSale', listType: ListingType.HOME };
    segmentOptions: Segment[] = [
      { title: 'AGENT.PropertiesforSale', listType: ListingType.HOME },
      { title: 'AGENT.Plots', listType: ListingType.PLOT },
      { title: 'AGENT.PropertiesforRent', listType: ListingType.RENTALHOME },
      { title: 'AGENT.VacationRentals', listType: ListingType.VACATIONRENTALS },
      { title: 'AGENT.Business_Properties_for_Sale', listType: ListingType.BUSINESSPROPERTY },
      { title: 'AGENT.Business_Properties_for_Rent', listType: ListingType.RENTALBUSINESSPROPERTY }
    ]
  isHomeLoading=true;
  isPlotLoading=true;
  isRentalHomeLoading=true;
  isRentalBusinessLoading=true;
  isBusinessLoading=true;
  isVacationRentalLoading=true;
  homes: Home[] = [];
  rentalHomes: Home[] = [];
  businesses: BusinessProperty[] = [];
  rentalBusinesses: BusinessProperty[] = [];
  plots: Plot[] = [];
  vacationHomes: HolidayHome[] = [];
  districts:District[]=[];
  valutas: ValutaOptions[] = [];



  constructor(private route:ActivatedRoute,private agentService:AgentService,private districtService:DistrictService,
private valutaService:ValutaService,private popoverCtrl:PopoverController

  ) {
    addIcons({chevronBack});
  }

  get listTypeEnum() {
    return ListingType;
  }


  ngOnInit() {
    const id=this.route.snapshot.paramMap.get('id');
    if(id){
      this.id=+id;
      this.fetchMakeelarDetails();
    }
  }

  fetchData(){
    if(this.selectedSegment.listType==ListingType.HOME){
      this.isHomeLoading=true;
      this.fetchHomes();
    }else if(this.selectedSegment.listType===ListingType.RENTALHOME){
      this.isRentalHomeLoading=true;
      this.fetchRentalHomes();
    }else if(this.selectedSegment.listType===ListingType.BUSINESSPROPERTY){
      this.isBusinessLoading=true;
      this.fetchBusinessProperties();
    }else if(this.selectedSegment.listType===ListingType.PLOT){
      this.isPlotLoading=true;
      this.fetchPlots();
    }else if(this.selectedSegment.listType===ListingType.RENTALBUSINESSPROPERTY){
      this.isRentalBusinessLoading=true;
      this.fetchRentalBusinessProperties();
    }else if(this.selectedSegment.listType===ListingType.VACATIONRENTALS){
      this.isVacationRentalLoading=true;
      this.fetchRentalVacations();
    }
  }

  fetchRentalVacations(){
    this.agentService.getRentalVacationPropertiesById(this.id,this.districts,this.valutas).subscribe(properties=>{
      this.vacationHomes=properties;
      this.isVacationRentalLoading=false;
    })

  }


  fetchRentalBusinessProperties(){
    this.agentService.getRentalBusinessPropertiesById(this.id,this.districts,this.valutas).subscribe(businesses=>{
      this.rentalBusinesses=businesses;
      this.isRentalBusinessLoading=false;
    })

  }


  fetchBusinessProperties(){
    this.agentService.getBusinessPropertiesById(this.id,this.districts,this.valutas).subscribe(businesses=>{
      this.businesses=businesses;
      this.isBusinessLoading=false;
    })

  }


  fetchPlots(){
    this.agentService.getPlotsById(this.id,this.districts,this.valutas).subscribe(plots=>{
      this.plots=plots;
      this.isPlotLoading=false;
    })

  }


  fetchRentalHomes(){
    this.agentService.getRentalHomesById(this.id,this.districts,this.valutas).subscribe(homes=>{
      this.rentalHomes=homes;
      this.isRentalHomeLoading=false;
    })

  }

  fetchHomes(){
    this.agentService.getHomesById(this.id,this.districts,this.valutas).subscribe(homes=>{
      console.log(this.valutas);
      this.homes=homes;
      console.log(this.homes);
      this.isHomeLoading=false;
    })
  }

  onSelectSegment(segment: Segment) {
    this.selectedSegment = segment;
    this.fetchData();
  }


  fetchMakeelarDetails(){
    combineLatest([this.districtService.isLoading$,this.valutaService.isLoading$,this.agentService.getMakeelarById(this.id)])
    .pipe(filter(([isDistrictLoading,isValutaLoading,_])=>!isDistrictLoading && !isValutaLoading))
    .subscribe(([_,,agent])=>{
      this.districts=this.districtService.districts;
      this.valutas=this.valutaService.valueOptions;
      this.agent=agent as AgentInfo;
      this.isLoading=false;
      this.fetchData();
    })
  }

  openEmail(email: string) {
    window.location.href = `mailto:${email}`;
  }

  async openPhoneNumber(phone: string,event:any) {
    const popover=await this.popoverCtrl.create({
      component:PhoneContactComponent,
      componentProps:{
        phone:phone
      },
      event:event,
      backdropDismiss:true,
      dismissOnSelect:true,
      reference:'trigger'
    });
    await popover.present();
    }


}
