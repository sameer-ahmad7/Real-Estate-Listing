import { Component, CUSTOM_ELEMENTS_SCHEMA, input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController, IonIcon } from '@ionic/angular/standalone';
import { SwiperOptions } from 'swiper/types';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline, closeOutline, downloadOutline, images } from 'ionicons/icons';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-fullscreen-view',
  templateUrl: './fullscreen-view.page.html',
  styleUrls: ['./fullscreen-view.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [IonIcon, CommonModule, FormsModule]
})
export class FullscreenViewPage implements OnInit,OnDestroy {
  fullViewIndex = input.required<number>();
  swiperConfig: SwiperOptions = {
    zoom: {
      maxRatio: 10,
      minRatio: 1
    },
    slidesPerView: 1,
    virtual: true
  }
  images = input.required<string[]>();
  currentIndex!: number;
  @ViewChild('fullSwiperElement') fullSwiperElement: any;



  constructor(private modalCtrl: ModalController) {
    addIcons({ images, chevronBackOutline, chevronForwardOutline, downloadOutline, closeOutline });
  }


  async ngOnInit() {
    if(Capacitor.isNativePlatform()){
      await ScreenOrientation.lock({ orientation: 'landscape' });
    }
    this.currentIndex = this.fullViewIndex();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.swiperConfig.initialSlide = this.fullViewIndex();
      Object.assign(this.fullSwiperElement.nativeElement, this.swiperConfig);
      this.fullSwiperElement.nativeElement.initialize();

    }, 500);

  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

  goToPrevFullSlide() {
    this.fullSwiperElement.nativeElement.swiper.slidePrev();
  }

  goToNextFullSlide() {
    this.fullSwiperElement.nativeElement.swiper.slideNext();
  }


  /** 🚀 Reset Zoom on Slide Change */
  updateFullViewIndex(event: any) {
    this.currentIndex = event.target.swiper.realIndex;
    if (event.target.swiper && event.target.swiper.zoom) {
      event.target.swiper.zoom.out(); // Reset zoom when switching slides
    }
  }

  async ngOnDestroy(): Promise<void> {
    if(Capacitor.isNativePlatform()){
      await ScreenOrientation.lock({orientation:'portrait'});
    }
  }

}
