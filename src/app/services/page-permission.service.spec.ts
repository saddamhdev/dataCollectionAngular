import { TestBed } from '@angular/core/testing';

import { PagePermissionService } from './page-permission.service';

describe('PagePermissionService', () => {
  let service: PagePermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagePermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
