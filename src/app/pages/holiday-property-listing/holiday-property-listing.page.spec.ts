import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HolidayPropertyListingPage } from './holiday-property-listing.page';

describe('HolidayPropertyListingPage', () => {
  let component: HolidayPropertyListingPage;
  let fixture: ComponentFixture<HolidayPropertyListingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayPropertyListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
