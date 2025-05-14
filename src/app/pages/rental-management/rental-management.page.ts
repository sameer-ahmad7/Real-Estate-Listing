import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonSpinner, IonCard, IonButton, IonText } from '@ionic/angular/standalone';
import { PageService } from 'src/app/services/page.service';
import { addIcons } from 'ionicons';
import { chevronBack } from 'ionicons/icons';
import { ContactUsPage } from "../contact-us/contact-us.page";
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { FileOpener } from '@capacitor-community/file-opener';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { CustomSpinnerPage } from "../custom-spinner/custom-spinner.page";
import { TranslateModule } from '@ngx-translate/core';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { LanguageService } from 'src/app/services/language.service';

@Component({
	selector: 'app-rental-management',
	templateUrl: './rental-management.page.html',
	styleUrls: ['./rental-management.page.scss'],
	standalone: true,
	imports: [IonText, IonButton, IonCard, IonBackButton, IonButtons, IonContent, TranslateModule,
		IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, ContactUsPage, CustomSpinnerPage]
})
export class RentalManagementPage implements OnInit, OnDestroy {

	htmlContent = '';
	imgSrc = '';
	downloadLink = '';
	isLoading = true;
	language$!: Subscription;
	language = '';
	private destroy$ = new Subject<void>();


	constructor(private pageService: PageService, private languageService: LanguageService, private elRef: ElementRef) {
		addIcons({ chevronBack });
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
			}

		});
	}



	ngOnInit() {
		this.language$ = this.languageService.language$
			.pipe(takeUntil(this.destroy$))
			.subscribe((lang) => {
				this.language = lang;
				this.fetchRentalManagementPage();
			});

	}

	fetchRentalManagementPage() {
		this.pageService.getRentalManagementPage(this.language).subscribe(res => {
			const content = res.content.rendered;
			const extractedHtml = this.pageService.extractRentalContent(content, this.language);
			this.htmlContent = extractedHtml.htmlString;
			this.imgSrc = extractedHtml.image;
			this.downloadLink = extractedHtml.downloadLink;
			this.downloadLink = this.downloadLink.replace(/^http:\/\//i, 'https://');
			this.isLoading = false;

		})

	}

	// Utility: Extract filename from URL
	extractFilename(url: string): string {
		return url.substring(url.lastIndexOf('/') + 1);
	}

	async downloadAndOpenPDF(): Promise<void> {
		const url = this.downloadLink;
		const filename = this.extractFilename(url);

		try {
			// ✅ Step 1: Download file natively — no CORS issues
			const result = await Filesystem.downloadFile({
				url,
				path: filename,
				directory: Directory.Documents, // or External if you handle permissions
			});

			const filePath = Capacitor.getPlatform() === 'ios'
				? result.path?.replace('file://', '')
				: result.path;

			if (!filePath) throw new Error('No file path returned from download');

			// ✅ Step 2: Open the file using FileOpener
			await FileOpener.open({
				filePath,
				contentType: 'application/pdf',
			});

			console.log('✅ PDF downloaded and opened:', filePath);
		} catch (error) {
			console.error('❌ Error downloading/opening PDF:', error);
		}
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

}
