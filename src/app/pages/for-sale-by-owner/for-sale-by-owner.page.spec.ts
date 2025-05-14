import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForSaleByOwnerPage } from './for-sale-by-owner.page';

describe('ForSaleByOwnerPage', () => {
  let component: ForSaleByOwnerPage;
  let fixture: ComponentFixture<ForSaleByOwnerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ForSaleByOwnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
