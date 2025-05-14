import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusinessPropertyDetailsPage } from './business-property-details.page';

describe('BusinessPropertyDetailsPage', () => {
  let component: BusinessPropertyDetailsPage;
  let fixture: ComponentFixture<BusinessPropertyDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessPropertyDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
