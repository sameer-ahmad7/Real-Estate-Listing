import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, clipboard, heart, ellipsisHorizontal } from 'ionicons/icons';
import { MapService } from '../services/map.service';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel,TranslateModule],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor(private mapService:MapService) {
    addIcons({ home, clipboard, heart, ellipsisHorizontal });
  }

  ngOnInit(){
    this.mapService.getLocation();
  }


}
