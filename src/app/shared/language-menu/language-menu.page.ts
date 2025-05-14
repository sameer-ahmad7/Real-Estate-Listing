import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonList, IonLabel} from '@ionic/angular/standalone';
import { LanguageService } from 'src/app/services/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-language-menu',
  templateUrl: './language-menu.page.html',
  styleUrls: ['./language-menu.page.scss'],
  standalone: true,
  imports: [IonLabel, IonList, IonItem,CommonModule, FormsModule,TranslateModule,IonContent]
})
export class LanguageMenuPage implements OnInit {

  constructor(private languageService:LanguageService) { }

  ngOnInit() {
  }

  setLanguage(language: string) {
    this.languageService.setLanguage(language);
  }

}
