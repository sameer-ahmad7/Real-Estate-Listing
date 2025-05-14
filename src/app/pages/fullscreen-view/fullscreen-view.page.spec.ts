import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FullscreenViewPage } from './fullscreen-view.page';

describe('FullscreenViewPage', () => {
  let component: FullscreenViewPage;
  let fixture: ComponentFixture<FullscreenViewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FullscreenViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
