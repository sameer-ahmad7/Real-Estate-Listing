import { Component, OnDestroy, OnInit } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import {
	IonList, IonItem, IonIcon, IonContent, IonLabel, IonHeader, IonTitle, IonToolbar, IonCardContent, IonCard, IonButtons, PopoverController, IonButton, IonPopover
} from '@ionic/angular/standalone';
import { NavMenu } from 'src/app/model/menu.model';
import { MenuService } from 'src/app/services/menu.service';
import { CustomSpinnerPage } from "../../pages/custom-spinner/custom-spinner.page";
import { addIcons } from 'ionicons';
import { chevronDown, chevronUp } from 'ionicons/icons';
import { LanguageMenuPage } from "../../shared/language-menu/language-menu.page";
import { LanguageService } from 'src/app/services/language.service';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";
import { Subject, Subscription, takeUntil } from 'rxjs';
import { RouterLink } from '@angular/router';


@Component({
	selector: 'app-home',
	templateUrl: './home.page.html',
	styleUrls: ['./home.page.scss'],
	standalone: true,
	imports: [IonPopover, IonButton, IonButtons, IonCard, IonCardContent, IonToolbar, IonTitle, IonHeader,
		TranslateModule, RouterLink,
		IonLabel, IonIcon, IonItem, IonList, IonContent, CustomSpinnerPage, LanguageMenuPage]
})
export class HomePage implements OnInit, OnDestroy {

	isLoading = true;
	projectDevelopmentMenu!: NavMenu;
	isConstructionExpanded = false;
	isProjectDevelopmentExpanded = false;
	constructionsMenu!: NavMenu;
	language$!: Subscription;
	language = '';
	private destroy$ = new Subject<void>();

	constructor(private menuService: MenuService, private languageService: LanguageService, private popoverCtrl: PopoverController) {
		addIcons({ chevronUp, chevronDown });
	}

	ngOnInit(): void {
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
				if (constructionsMenu) {
					this.constructionsMenu = constructionsMenu;
				}
				if (projectDevelopmentMenu) {
					this.projectDevelopmentMenu = projectDevelopmentMenu;
				}
				this.isLoading = false;
			} else {
				console.log(menu);
				const servicesMenu = menu.find(m => m.title.toLowerCase() === 'Diensten');
				const constructionsMenu = menu.find(m => m.title.toLowerCase() === 'Bouw & Infra'.toLowerCase());
				const projectDevelopmentMenu = menu.find(m => m.title.toLowerCase() === 'Verkavelingsprojecten'.toLowerCase());
				if (constructionsMenu) {
					this.constructionsMenu = constructionsMenu;
				}
				if (projectDevelopmentMenu) {
					this.projectDevelopmentMenu = projectDevelopmentMenu;
				}
				this.isLoading = false;


			}
		});

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


	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}


}
