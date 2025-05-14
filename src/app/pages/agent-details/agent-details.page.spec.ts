import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgentDetailsPage } from './agent-details.page';

describe('AgentDetailsPage', () => {
  let component: AgentDetailsPage;
  let fixture: ComponentFixture<AgentDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
