import { Component, Input,  OnInit } from '@angular/core';
import { IonLabel, IonItem, IonIcon, IonList } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { call, logoWhatsapp } from 'ionicons/icons';

@Component({
  selector: 'app-phone-contact',
  templateUrl: './phone-contact.component.html',
  styleUrls: ['./phone-contact.component.scss'],
  standalone: true,
  imports: [IonItem, IonLabel, IonIcon, IonList]
})
export class PhoneContactComponent  implements OnInit {

 @Input() phone!:string;

  constructor() {
    addIcons({call,logoWhatsapp});
  }

  ngOnInit() {}

  openPhone(){
    window.location.href = `tel:${this.phone}`;
  }

  openWhatsApp(){
    const whatsappUrl = `https://wa.me/${this.phone}`;
    window.open(whatsappUrl, '_system');
  }

}
