import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlotDetailsPage } from './plot-details.page';

describe('PlotDetailsPage', () => {
  let component: PlotDetailsPage;
  let fixture: ComponentFixture<PlotDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
