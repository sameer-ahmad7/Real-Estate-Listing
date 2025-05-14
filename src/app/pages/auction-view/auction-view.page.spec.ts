import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuctionViewPage } from './auction-view.page';

describe('AuctionViewPage', () => {
  let component: AuctionViewPage;
  let fixture: ComponentFixture<AuctionViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
