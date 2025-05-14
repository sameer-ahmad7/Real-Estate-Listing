import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RentalManagementPage } from './rental-management.page';

describe('RentalManagementPage', () => {
  let component: RentalManagementPage;
  let fixture: ComponentFixture<RentalManagementPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RentalManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
