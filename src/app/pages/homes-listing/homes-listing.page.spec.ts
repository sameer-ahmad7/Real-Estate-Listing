import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomesListingPage } from './homes-listing.page';

describe('HomesListingPage', () => {
  let component: HomesListingPage;
  let fixture: ComponentFixture<HomesListingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomesListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
