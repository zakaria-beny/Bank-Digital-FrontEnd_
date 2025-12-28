import { TestBed } from '@angular/core/testing';

import { AuthSerivce } from './auth-serivce';

describe('AuthSerivce', () => {
  let service: AuthSerivce;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthSerivce);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
