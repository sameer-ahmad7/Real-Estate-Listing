import { TestBed } from '@angular/core/testing';

import { LandTitleService } from './land-title.service';

describe('LandTitleService', () => {
  let service: LandTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
