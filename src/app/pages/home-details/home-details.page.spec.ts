import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeDetailsPage } from './home-details.page';

describe('HomeDetailsPage', () => {
  let component: HomeDetailsPage;
  let fixture: ComponentFixture<HomeDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
