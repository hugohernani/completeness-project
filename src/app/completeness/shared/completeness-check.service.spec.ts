import { TestBed, inject } from '@angular/core/testing';

import { CompletenessCheckService } from './completeness-check.service';

describe('CompletenessCheckService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompletenessCheckService]
    });
  });

  it('should be created', inject([CompletenessCheckService], (service: CompletenessCheckService) => {
    expect(service).toBeTruthy();
  }));
});
