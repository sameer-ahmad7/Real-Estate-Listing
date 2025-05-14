import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageMenuPage } from './language-menu.page';

describe('LanguageMenuPage', () => {
  let component: LanguageMenuPage;
  let fixture: ComponentFixture<LanguageMenuPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
