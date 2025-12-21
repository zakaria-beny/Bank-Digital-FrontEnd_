import { TestBed } from '@angular/core/testing';

import { ClientsSerivces } from './clients-serivces';

describe('ClientsSerivces', () => {
  let service: ClientsSerivces;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientsSerivces);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
