import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PageInfo } from '../model/page.model';

@Injectable({
	providedIn: 'root'
})
export class PageService {

	private apiURL = `${environment.apiURL}/wp`;
	private oilGasPageSlug = 'suriname-oil-gas';
	private aboutUsPageId = '37848';
	private auctionPageId = '112185';
	private rentalManagementPageId = '112109';

	constructor(private http: HttpClient) { }

	getRentalManagementPage(lang: string = 'en') {
		let pageId = this.rentalManagementPageId;
		if (lang === 'nl') {
			pageId = '826';
		}
		const url = `${this.apiURL}/v2/pages/${pageId}`;
		return this.http.get<PageInfo>(url);
	}

	extractRentalContent(htmlString: string, lang: string = 'en'): { image: string; htmlString: string; downloadLink: string } {
		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlString, 'text/html');
		console.log(doc);
		// 1. Extract image src with class arve-thumbnail
		let imgElement = doc.querySelector('[alt="Management of vacation rentals in Suriname"]');
		if (lang === 'nl') {
			imgElement = doc.querySelector('[alt="Beheer van vakantiewoningen in Suriname"]');
		}
		let thumbnailSrc = imgElement?.getAttribute('src') || null;
		if (thumbnailSrc) {
			thumbnailSrc = thumbnailSrc.replace(/^http:\/\//i, 'https://');
		}



		let downloadLink = '';

		const downloadElement = doc.querySelector('.tb-button__link');
		if (downloadElement) {
			const link = downloadElement.getAttribute('href');
			if (link) {
				downloadLink = link;
			}
		}

		// 2. Extract content from specific data-toolset-blocks-container
		const containerDiv = doc.querySelector('[data-toolset-blocks-container="385d28b7871518a74c5308d6356888d9"]');

		const unwantedDiv = containerDiv?.querySelector('.tb-button__link');
		if (unwantedDiv) {
			unwantedDiv.remove();
		}


		const blockContent = containerDiv?.innerHTML || null;

		return { image: thumbnailSrc as string, htmlString: blockContent as string, downloadLink };
	}

	getAboutPage(lang: string = 'en') {
		let pageId = this.aboutUsPageId;
		if (lang === 'nl') {
			pageId = '296';
		}
		const url = `${this.apiURL}/v2/pages/${pageId}`;
		return this.http.get<PageInfo>(url);
	}

	getAuctionPage(lang: string = 'en') {
		console.log(lang);
		let pageId = this.auctionPageId;
		if (lang === 'nl') {
			pageId = '36588'
		}
		const url = `${this.apiURL}/v2/pages/${pageId}`;
		return this.http.get<PageInfo>(url);
	}

	getOilGasPage() {
		const url = `${this.apiURL}/v2/pages`;
		const params = new HttpParams().set('slug', this.oilGasPageSlug);
		return this.http.get<PageInfo[]>(url, { params });
	}

	extractAuctionContent(htmlString: string) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlString, 'text/html');
		const linkMap: { [key: string]: string } = {
			'http://www.''.com/en/contact-en/': '/contact-us',
			'http://www.''.com/en/real-estate-offer/purchase-offer/': '/tabs/home',
			'http://www.''.com/en/real-estate-offer/': '/tabs/home',
			'http://www.''.com/vastgoedaanbod/kopen/veilingen': '/auctions-listing',
		};

		const anchorTags = doc.querySelectorAll('a');

		anchorTags.forEach(anchor => {
			let href = anchor.getAttribute('href') as string;
			if (!href) return;

			const matchedRoute = Object.keys(linkMap).find(link => href.trim().includes(link));
			if (matchedRoute) {
				anchor.removeAttribute('href');
				anchor.setAttribute('href', linkMap[matchedRoute]);
			} else {
				href = href.replace(/^http:\/\//i, 'https://');

				// Add "/en" if it's an internal link and doesn't already have it
				if (href.startsWith('https://www.''.com/') && !href.startsWith('https://www.''.com/en')) {
					href = href.replace('https://www.''.com/', 'https://www.''.com/en/');
				}

			}
		});

		// 2. Extract content from specific data-toolset-blocks-container
		const containerDiv = doc.querySelector('[data-toolset-blocks-container="fb454a1c9c18b6240177432d73d8297b"]');
		// Remove the unwanted inner div
		const unwantedDiv = containerDiv?.querySelector('.wp-block-toolset-blocks-container.tb-container.aanbodcontact');
		if (unwantedDiv) {
			unwantedDiv.remove();
		}

		const blockContent = containerDiv?.innerHTML || null;

		return blockContent;
	}


	extractAboutContent(htmlString: string): { image: string; htmlString: string; } {
		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlString, 'text/html');
		// 1. Extract image src with class arve-thumbnail
		const imgElement = doc.querySelector('img.arve-thumbnail');
		let thumbnailSrc = imgElement?.getAttribute('src') || null;
		if (imgElement) {
			const srcSets = imgElement.getAttribute('srcset');
			if (srcSets) {
				thumbnailSrc = srcSets;
			}
		}
		if (thumbnailSrc) {
			thumbnailSrc = thumbnailSrc.replace(/^http:\/\//i, 'https://');
		}


		// 2. Extract content from specific data-toolset-blocks-container
		const containerDiv = doc.querySelector('[data-toolset-blocks-container="e39ca0c06f1b6efc125036d1509bbc42"]');
		const blockContent = containerDiv?.innerHTML || null;

		return { image: thumbnailSrc as string, htmlString: blockContent as string };
	}

	extractFilteredContent(htmlString: string): string {
		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlString, 'text/html');

		const container = doc.querySelector('[data-toolset-blocks-container="ffea3bafbea73c01973419dcbae41fef"]');

		if (!container) {
			return '';
		}

		// Remove the unwanted inner div
		const unwantedDiv = container.querySelector('.lightweight-accordion.has-text-color.has-background');
		if (unwantedDiv) {
			unwantedDiv.remove();
		}

		// Return only the inner HTML of the container
		return container.innerHTML;
	}


}
