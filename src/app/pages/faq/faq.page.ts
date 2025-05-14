import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonChip, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBack } from 'ionicons/icons';
import { FAQ, FaqType } from 'src/app/model/faq.model';
import { FaqService } from 'src/app/services/faq.service';
import { FaqViewPage } from "./faq-view/faq-view.page";
import { CustomSpinnerPage } from "../custom-spinner/custom-spinner.page";
import { TranslateModule } from '@ngx-translate/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { LanguageService } from 'src/app/services/language.service';


interface Segment{
  title:string;
  faqType:FaqType;
}



@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
  standalone: true,
  imports: [ IonChip, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle,TranslateModule,
    IonToolbar, CommonModule, FormsModule, FaqViewPage, CustomSpinnerPage]
})
export class FaqPage implements OnInit,OnDestroy {

  isAppraisalLoading=true;
  isBuyLoading=true;
  isSellLoading=true;
  isRentLoading=true;
  isRentalLoading=true;
  isMortgageLoading=true;
  isAdvertisingLoading=true;

  segments:Segment[]=[
    {
      title:'FAQ.Appraisals',
      faqType:FaqType.Appraisals
    },{
      title:'FAQ.Buy',
      faqType:FaqType.Buy
    },
    {
      title:'FAQ.Sell',
      faqType:FaqType.Sell
    },
    {
      title:'FAQ.Rent',
      faqType:FaqType.Rent
    },{
      title:'FAQ.Rental',
      faqType:FaqType.Rental
    },{
      title:'FAQ.Mortgage',
      faqType:FaqType.Mortgage
    },{
      title:'FAQ.Advertising',
      faqType:FaqType.Advertising
    }
  ]

  selectedSegment:Segment=this.segments[0];

  appraisalsFaq:FAQ[]=[];
  buyFaq:FAQ[]=[];
  sellFaq:FAQ[]=[];
  rentFaq:FAQ[]=[];
  rentalFaq:FAQ[]=[];
  mortgageFaq:FAQ[]=[];
  advertisingFaq:FAQ[]=[];
  language$!:Subscription;
  language='';
  private destroy$=new Subject<void>();

  constructor(private faqService:FaqService,private languageService:LanguageService) {
    addIcons({chevronBack});
  }

  get faqTypeEnum(){
    return FaqType;
  }

  onSelectSegment(segment:Segment){
    this.selectedSegment=segment;
    if(segment.faqType===FaqType.Appraisals){
      if(this.isAppraisalLoading){
        this.fetchListing();
      }
    }else if(segment.faqType===FaqType.Buy){
      if(this.isBuyLoading){
      this.fetchListing();
      }
    }else if(segment.faqType===FaqType.Rent){
      if(this.isRentLoading){
      this.fetchListing();
    }
  }
  else if(segment.faqType===FaqType.Sell){
    if(this.isSellLoading){
      this.fetchListing();
    }
  }else if(segment.faqType===FaqType.Rental){
    if(this.isRentalLoading){
      this.fetchListing();
    }
  }else if(segment.faqType===FaqType.Mortgage){
    if(this.isMortgageLoading){
      this.fetchListing();
    }
  }else if(segment.faqType===FaqType.Advertising){
    if(this.isAdvertisingLoading){
      this.fetchListing();
    }
  }
  }

  ngOnInit() {
        this.language$=this.languageService.language$
        .pipe(takeUntil(this.destroy$))
        .subscribe((lang)=>{
          this.language=lang;
          this.fetchListing();
        });

  }

  fetchListing(){

    this.faqService.fetchFaqs(this.selectedSegment.faqType,this.language)
    .subscribe(faqs=>{
      const segment=this.selectedSegment;
      if(segment.faqType===FaqType.Appraisals){
        this.appraisalsFaq=faqs;
        this.isAppraisalLoading=false;
      }else if(segment.faqType===FaqType.Buy){
        this.buyFaq=faqs;
        this.isBuyLoading=false;
      }else if(segment.faqType===FaqType.Rent){
        this.rentFaq=faqs;
        this.isRentLoading=false;
    }
    else if(segment.faqType===FaqType.Sell){
      this.sellFaq=faqs;
      this.isSellLoading=false;
    }else if(segment.faqType===FaqType.Rental){
      this.rentalFaq=faqs;
      this.isRentalLoading=false;

    }else if(segment.faqType===FaqType.Mortgage){
      this.mortgageFaq=faqs;
      this.isMortgageLoading=false;
    }else if(segment.faqType===FaqType.Advertising){
      this.advertisingFaq=faqs;
      this.isAdvertisingLoading=false;
    }
    })

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
