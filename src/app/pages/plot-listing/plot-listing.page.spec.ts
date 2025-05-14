import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlotListingPage } from './plot-listing.page';

describe('PlotListingPage', () => {
  let component: PlotListingPage;
  let fixture: ComponentFixture<PlotListingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
