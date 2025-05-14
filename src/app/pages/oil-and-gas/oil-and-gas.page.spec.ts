import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OilAndGasPage } from './oil-and-gas.page';

describe('OilAndGasPage', () => {
  let component: OilAndGasPage;
  let fixture: ComponentFixture<OilAndGasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OilAndGasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
