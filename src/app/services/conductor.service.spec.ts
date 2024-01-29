import { TestBed } from '@angular/core/testing';

import { ConductorService } from './conductor.service';

describe('ConductorServiceService', () => {
  let service: ConductorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConductorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
