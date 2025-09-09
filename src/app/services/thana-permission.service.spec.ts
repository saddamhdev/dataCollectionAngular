import { TestBed } from '@angular/core/testing';

import { ThanaPermissionService } from './thana-permission.service';

describe('ThanaPermissionService', () => {
  let service: ThanaPermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThanaPermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
