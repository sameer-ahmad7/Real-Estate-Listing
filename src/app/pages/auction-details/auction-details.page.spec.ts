import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuctionDetailsPage } from './auction-details.page';

describe('AuctionDetailsPage', () => {
  let component: AuctionDetailsPage;
  let fixture: ComponentFixture<AuctionDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
