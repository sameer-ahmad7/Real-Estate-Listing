import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessPropertyFilterPage } from './business-property-filter.page';

describe('BusinessPropertyFilterPage', () => {
  let component: BusinessPropertyFilterPage;
  let fixture: ComponentFixture<BusinessPropertyFilterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessPropertyFilterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
