import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeFilterPage } from './home-filter.page';

describe('HomeFilterPage', () => {
  let component: HomeFilterPage;
  let fixture: ComponentFixture<HomeFilterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeFilterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
