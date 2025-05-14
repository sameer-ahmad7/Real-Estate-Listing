import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaqViewPage } from './faq-view.page';

describe('FaqViewPage', () => {
  let component: FaqViewPage;
  let fixture: ComponentFixture<FaqViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
