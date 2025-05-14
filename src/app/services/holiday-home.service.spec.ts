import { TestBed } from '@angular/core/testing';

import { HolidayHomeService } from './holiday-home.service';

describe('HolidayHomeService', () => {
  let service: HolidayHomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HolidayHomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
