import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, PopoverController, IonCard, IonIcon } from '@ionic/angular/standalone';
import { PageService } from 'src/app/services/page.service';
import { addIcons } from 'ionicons';
import { chevronBack } from 'ionicons/icons';
import { CustomSpinnerPage } from "../custom-spinner/custom-spinner.page";
import { TranslateModule } from '@ngx-translate/core';
import { PhoneContactComponent } from 'src/app/shared/phone-contact/phone-contact.component';

@Component({
  selector: 'app-oil-and-gas',
  templateUrl: './oil-and-gas.page.html',
  styleUrls: ['./oil-and-gas.page.scss'],
  standalone: true,
  imports: [IonIcon, IonCard,  IonButtons, IonBackButton, IonContent, IonHeader, IonTitle,
    TranslateModule,
    IonToolbar, CommonModule, FormsModule, CustomSpinnerPage]
})
export class OilAndGasPage implements OnInit {

  isLoading = true;
  htmlContent = '';

  constructor(private pageService: PageService,private popoverCtrl:PopoverController) {
    addIcons({ chevronBack });
  }

  ngOnInit() {
    this.pageService.getOilGasPage().subscribe(res => {
      const content = res[0].content.rendered;
      const extractedResponse = this.pageService.extractFilteredContent(content);
      this.htmlContent = extractedResponse;
      this.isLoading = false;
    });
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
