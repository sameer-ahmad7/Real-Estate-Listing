import { TestBed } from '@angular/core/testing';

import { BusinessPropertyService } from './business-property.service';

describe('BusinessPropertyService', () => {
  let service: BusinessPropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessPropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
