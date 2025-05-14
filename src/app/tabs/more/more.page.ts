import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
	IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonIcon, IonLabel, IonList, IonCard, PopoverController,
	IonCardContent, IonButtons, IonButton
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { chevronDown, chevronUp } from 'ionicons/icons';
import { MenuService } from 'src/app/services/menu.service';
import { NavMenu } from 'src/app/model/menu.model';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { CustomSpinnerPage } from "../../pages/custom-spinner/custom-spinner.page";
import { TranslateModule } from '@ngx-translate/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { LanguageService } from 'src/app/services/language.service';
import { LanguageMenuPage } from "../../shared/language-menu/language-menu.page";

@Component({
	selector: 'app-more',
	templateUrl: './more.page.html',
	styleUrls: ['./more.page.scss'],
	standalone: true,
	imports: [IonButton, IonButtons, IonCardContent, IonCard, IonList, IonLabel, IonIcon, TranslateModule,
		IonItem, IonContent, IonHeader, IonTitle, RouterLink, IonToolbar, CommonModule, FormsModule, CustomSpinnerPage, LanguageMenuPage]
})
export class MorePage implements OnInit, OnDestroy {

	isServicesExpanded = false;
	isConstructionExpanded = false;
	isProjectDevelopmentExpanded = false;
	isLoading = true;
	menu: NavMenu[] = [];
	servicesMenu!: NavMenu;
	constructionsMenu!: NavMenu;
	projectDevelopmentMenu!: NavMenu;
	language$!: Subscription;
	language = '';
	private destroy$ = new Subject<void>();


	constructor(private menuService: MenuService, private languageService: LanguageService, private popoverCtrl: PopoverController) {
		addIcons({ chevronDown, chevronUp });
	}

	ngOnInit() {

		this.language$ = this.languageService.language$
			.pipe(takeUntil(this.destroy$))
			.subscribe((lang) => {
				this.language = lang;
				this.fetchMenu();
			});

	}

	async openLanguageMenu(ev: any) {
		const popover = await this.popoverCtrl.create({
			component: LanguageMenuPage,
			event: ev,
		});
		await popover.present();
	}



	fetchMenu() {
		this.menuService.fetchMainMenu(this.language).subscribe(menu => {
			if (this.language === 'en') {
				const servicesMenu = menu.find(m => m.title.toLowerCase() === 'services');
				const constructionsMenu = menu.find(m => m.title.toLowerCase() === ''' Construction &amp; Infra'.toLowerCase());
				const projectDevelopmentMenu = menu.find(m => m.title.toLowerCase() === 'Project Development'.toLowerCase());
				if (servicesMenu) {
					this.servicesMenu = servicesMenu;
				}
				if (constructionsMenu) {
					this.constructionsMenu = constructionsMenu;
				}
				if (projectDevelopmentMenu) {
					this.projectDevelopmentMenu = projectDevelopmentMenu;
				}
			} else {
				const servicesMenu = menu.find(m => m.title.toLowerCase() === 'Diensten');
				const constructionsMenu = menu.find(m => m.title.toLowerCase() === 'Bouw & Infra'.toLowerCase());
				const projectDevelopmentMenu = menu.find(m => m.title.toLowerCase() === 'Verkavelingsprojecten'.toLowerCase());
				if (servicesMenu) {
					this.servicesMenu = servicesMenu;
				}
				if (constructionsMenu) {
					this.constructionsMenu = constructionsMenu;
				}
				if (projectDevelopmentMenu) {
					this.projectDevelopmentMenu = projectDevelopmentMenu;
				}

			}
			this.isLoading = false;

		})

	}

	toggleConstructionExpansion() {
		this.isConstructionExpanded = !this.isConstructionExpanded;
	}

	toggleProjectDevelopmentExpansion() {
		this.isProjectDevelopmentExpanded = !this.isProjectDevelopmentExpanded;
	}


	gotoDetails(url: string) {
		if (Capacitor.isNativePlatform()) {
			Browser.open({ url });
		}
	}

	toggleServicesExpansion() {
		this.isServicesExpanded = !this.isServicesExpanded;
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

}
