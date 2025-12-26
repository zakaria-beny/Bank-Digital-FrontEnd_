import { TestBed } from '@angular/core/testing';

import {ComptesServices } from './comptes-serivces';

describe('ComptesServices', () => {
  let service: ComptesServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComptesServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
