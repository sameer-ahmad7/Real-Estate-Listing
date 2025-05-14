import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons,  IonCard,  IonText } from '@ionic/angular/standalone';
import { PageService } from 'src/app/services/page.service';
import { addIcons } from 'ionicons';
import { chevronBack, logoYoutube } from 'ionicons/icons';
import { SafeUrlPipe } from "../../pipes/safe-url.pipe";
import { ContactUsPage } from "../contact-us/contact-us.page";
import { CustomSpinnerPage } from "../custom-spinner/custom-spinner.page";
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
  standalone: true,
  imports: [IonText,  IonButtons, IonBackButton, IonContent, IonHeader, IonTitle,
    TranslateModule,
    IonToolbar, CommonModule, FormsModule, SafeUrlPipe, ContactUsPage, CustomSpinnerPage]
})
export class AboutUsPage implements OnInit,OnDestroy {

  htmlContent = '';
  imgSrc = '';
  isPlaying = false;
  isLoading = true;
  youtubeVideoURL = 'https://www.youtube-nocookie.com/embed/aUdkj-5oywU?feature=oembed&iv_load_policy=3&modestbranding=1&rel=0&autohide=1&playsinline=0&autoplay=1&enablejsapi=1&controls=0';
  isImageLoaded=false;
  language$!:Subscription;
  language='';
  private destroy$=new Subject<void>();

  constructor(private pageService: PageService,private languageService: LanguageService) {
    addIcons({ logoYoutube, chevronBack });
  }

  ngOnInit() {

        this.language$=this.languageService.language$
        .pipe(takeUntil(this.destroy$))
        .subscribe((lang)=>{
          this.language=lang;
          this.fetchAboutPage();
        });


  }

  fetchAboutPage() {
    this.pageService.getAboutPage(this.language).subscribe(res => {
      const content = res.content.rendered;
      const extractedHtml = this.pageService.extractAboutContent(content);
      this.htmlContent = extractedHtml.htmlString;
      this.imgSrc = extractedHtml.image;
      this.isLoading = false;
    });

  }

  onImageLoad(){
    this.isImageLoaded=true;
  }

  playVideo() {
    this.isPlaying = true;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
