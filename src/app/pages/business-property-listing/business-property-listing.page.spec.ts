import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessPropertyListingPage } from './business-property-listing.page';

describe('BusinessPropertyListingPage', () => {
  let component: BusinessPropertyListingPage;
  let fixture: ComponentFixture<BusinessPropertyListingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessPropertyListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
