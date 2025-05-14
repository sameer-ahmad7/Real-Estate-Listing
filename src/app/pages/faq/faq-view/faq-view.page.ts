import { Component, ElementRef, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonCard } from '@ionic/angular/standalone';
import { FAQ } from 'src/app/model/faq.model';
import { addIcons } from 'ionicons';
import { chevronDownCircleOutline, chevronUpCircleOutline } from 'ionicons/icons';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { LanguageService } from 'src/app/services/language.service';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
	selector: 'app-faq-view',
	templateUrl: './faq-view.page.html',
	styleUrls: ['./faq-view.page.scss'],
	standalone: true,
	imports: [IonCard, IonIcon, CommonModule, FormsModule]
})
export class FaqViewPage implements OnInit {

	faq = input.required<FAQ>();

	isExpanded = false;
	isLoading = true;
	language$!: Subscription;
	language = '';
	private destroy$ = new Subject<void>();


	constructor(private elRef: ElementRef, private languageService: LanguageService) {
		addIcons({ chevronDownCircleOutline, chevronUpCircleOutline });
	}

	ngOnInit() {
		this.language$ = this.languageService.language$
			.pipe(takeUntil(this.destroy$))
			.subscribe((lang) => {
				this.language = lang;
			});

	}

	ngAfterViewInit() {
		this.elRef.nativeElement.addEventListener('click', (event: Event) => {
			const target = event.target as HTMLElement;
			if (target.tagName === 'A') {
				event.preventDefault();
				let link = target.getAttribute('href');
				if (link) {
					link = link.replace(/^http:\/\//i, 'https://');
					if (this.language === 'en') {
						if (link.startsWith('https://www.''.com/') && !link.startsWith('https://www.''.com/en')) {
							link = link.replace('https://www.''.com/', 'https://www.''.com/en/');
							if (Capacitor.isNativePlatform()) {
								Browser.open({ url: link });
							}
						}
					} else {
						if (Capacitor.isNativePlatform()) {
							Browser.open({ url: link });
						}

					}

				}
				// Add "/en" if it's an internal link and doesn't already have it

				// const path = target.getAttribute('data-router-link');
				// if (path) {
				//   this.router.navigateByUrl(path);
				// }
			}
		});
	}

	toggleExpansion() {
		this.isExpanded = !this.isExpanded;
	}

	ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}

}
