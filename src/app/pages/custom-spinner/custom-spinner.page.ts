import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-custom-spinner',
  templateUrl: './custom-spinner.page.html',
  styleUrls: ['./custom-spinner.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CustomSpinnerPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
