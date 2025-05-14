import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {


  private _language$=new BehaviorSubject<string>('en');

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['nd', 'en']);
    this.translate.setDefaultLang('en');
    this.loadLanguage();
  }

  loadLanguage(){
    const language = this.getLanguage();
    console.log(language);
    this.translate.use(language);
    this._language$.next(language);
  }

  getLanguage(): string {
    return localStorage.getItem('language') || 'en';
  }
  setLanguage(language: string): void {
    localStorage.setItem('language', language);
    this.translate.use(language);
    this._language$.next(language);
  }

  get language$(){
    return this._language$.asObservable();
  }

}
