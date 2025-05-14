import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HolidayHomeDetailsPage } from './holiday-home-details.page';

describe('HolidayHomeDetailsPage', () => {
  let component: HolidayHomeDetailsPage;
  let fixture: ComponentFixture<HolidayHomeDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HolidayHomeDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
