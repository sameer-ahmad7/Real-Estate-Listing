import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonSpinner, IonCard } from '@ionic/angular/standalone';
import { PageService } from 'src/app/services/page.service';
import { addIcons } from 'ionicons';
import { chevronBack } from 'ionicons/icons';
import { AuctionService } from 'src/app/services/auction.service';
import { combineLatest, filter, Subject, Subscription, take, takeUntil } from 'rxjs';
import { District } from 'src/app/model/districts.model';
import { ValutaOptions } from 'src/app/model/valuta-model';
import { DistrictService } from 'src/app/services/district.service';
import { ValutaService } from 'src/app/services/valuta.service';
import { AuctionProperty } from 'src/app/model/auction.model';
import { AuctionViewPage } from "../auction-view/auction-view.page";
import { SwiperOptions } from 'swiper/types';
import { CustomSpinnerPage } from '../custom-spinner/custom-spinner.page';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';

@Component({
  selector: 'app-auctions',
  templateUrl: './auctions.page.html',
  styleUrls: ['./auctions.page.scss'],
  standalone: true,
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonCard, CustomSpinnerPage, IonBackButton,
    TranslateModule,
    IonButtons, IonContent, IonHeader,
    IonTitle, IonToolbar, CommonModule, FormsModule, AuctionViewPage]
})
export class AuctionsPage implements OnInit {

    @ViewChild('auctionSlides', { static: false }) swiperAuctionElement: any;
    @ViewChild('auctionedSlides', { static: false }) swiperAuctionedElement: any;
  isLoading=true;
  isAuctionLoading=true;
  isAuctionedLoading=true;
  isPreviousAuctionLoading=true;
  isPreviousAuctionedLoading=false;
  htmlString='';
  displayedContent = '';
  maxLength: number = 900;
  showFullContent = false;
selectedSegment:'auction'|'auctioned'='auction';
districts:District[]=[];
valutas:ValutaOptions[]=[];
auctionProperties:AuctionProperty[]=[];
auctionedProperties:AuctionProperty[]=[];
  language$!:Subscription;
    language='';
    private destroy$=new Subject<void>();

  constructor(private pageService:PageService,private languageService: LanguageService,
    private districtService:DistrictService,private valutaService:ValutaService,
    private auctionService:AuctionService) {
    addIcons({chevronBack});
  }

  ngOnInit() {
        this.language$=this.languageService.language$
        .pipe(takeUntil(this.destroy$))
        .subscribe((lang)=>{
          this.language=lang;
   this.fetchAuctionPage();
        });

  }

  fetchAuctionPage(){
    this.pageService.getAuctionPage(this.language).subscribe(res=>{
      const content=res.content.rendered;
     const extractedHtml= this.pageService.extractAuctionContent(content);
     this.htmlString=extractedHtml as string;
     if(this.language==='en'){
      this.displayedContent = this.htmlString.slice(0, this.maxLength) + '<p class="read">Read more</p>';

     }else{
      this.displayedContent = this.htmlString.slice(0, this.maxLength) + '<p class="read">Lees meer</p>';

     }
     this.isLoading=false;
     combineLatest(([this.districtService.isLoading$,this.valutaService.isLoading$]))
     .pipe(filter(([isDistrictLoading,isValutaloading])=>!isDistrictLoading && !isValutaloading),
    take(1)
    ).subscribe(_=>{
      this.districts=this.districtService.districts;
      this.valutas=this.valutaService.valueOptions;
      this.fetchListings();
    })
    })

  }

  ngDoCheck() {
    // Detect change in `isLoading`
    if (this.isPreviousAuctionLoading !== this.isAuctionLoading && !this.isAuctionLoading) {
      this.isPreviousAuctionLoading = this.isAuctionLoading;
      setTimeout(()=>{
        if(this.auctionProperties.length>0){
          this.initializeAuctionSlides();
        }
      },1200);
    }
    if (this.isPreviousAuctionedLoading !== this.isAuctionedLoading && !this.isAuctionedLoading) {
      this.isPreviousAuctionedLoading = this.isAuctionedLoading;
      setTimeout(()=>{
        if(this.auctionedProperties.length>0){
        this.initializeAuctionedSlides();
        }
      },1200);
    }

  }

  initializeAuctionSlides(){
        const swiperOptions: SwiperOptions = {
          slidesPerView: 1,
          spaceBetween: 10, // Adjust spacing between slides
          pagination: {
            clickable: true,
            type: 'bullets', // Dots for pagination
            dynamicBullets: true, // For limited number of bullets
          },
          navigation: false, // Disables arrows
          virtual: true
        }
        // const swiperInstance = new Swiper(this.swiperElement.nativeElement, swiperParams);
        Object.assign(this.swiperAuctionElement.nativeElement, swiperOptions);
        this.swiperAuctionElement.nativeElement.initialize();
  }

  initializeAuctionedSlides(){
    const swiperOptions: SwiperOptions = {
      slidesPerView: 1,
      spaceBetween: 10, // Adjust spacing between slides
      pagination: {
        clickable: true,
        type: 'bullets', // Dots for pagination
        dynamicBullets: true, // For limited number of bullets
      },
      navigation: false, // Disables arrows
      virtual: true
    }
    // const swiperInstance = new Swiper(this.swiperElement.nativeElement, swiperParams);
    Object.assign(this.swiperAuctionedElement.nativeElement, swiperOptions);
    this.swiperAuctionedElement.nativeElement.initialize();

  }


  fetchListings(){
    if(this.selectedSegment==='auction'){
      this.auctionService.getAuctions(this.districts,this.valutas).pipe(take(1))
      .subscribe(auctions=>{
        this.auctionProperties=auctions;
        this.isAuctionLoading=false;
      })
    }else if(this.selectedSegment==='auctioned'){
      this.auctionService.getAuctions(this.districts,this.valutas,false).pipe(take(1))
      .subscribe(auctions=>{
        this.auctionedProperties=auctions;
        this.isAuctionedLoading=false;
      })

    }
  }

  onSelectSegment(value:'auction'|'auctioned'){
    this.selectedSegment=value;
    if(value==='auctioned' && this.isAuctionedLoading){
      this.fetchListings();
    }else if(value==='auction' && this.isAuctionLoading){
      this.fetchListings();
    }
  }

  toggleContent() {
    this.showFullContent = !this.showFullContent;
    this.updateDisplayedContent();
  }

  updateDisplayedContent() {
    this.displayedContent = this.showFullContent ? this.htmlString: this.htmlString.slice(0, this.maxLength) + '<p class="read">Read more</p>';
  }



}
