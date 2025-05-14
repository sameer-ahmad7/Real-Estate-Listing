import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlotFilterPage } from './plot-filter.page';

describe('PlotFilterPage', () => {
  let component: PlotFilterPage;
  let fixture: ComponentFixture<PlotFilterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotFilterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
