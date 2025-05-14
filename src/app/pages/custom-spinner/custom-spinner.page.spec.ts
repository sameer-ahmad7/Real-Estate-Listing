import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomSpinnerPage } from './custom-spinner.page';

describe('CustomSpinnerPage', () => {
  let component: CustomSpinnerPage;
  let fixture: ComponentFixture<CustomSpinnerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSpinnerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
