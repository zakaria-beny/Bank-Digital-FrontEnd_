import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoveauClient } from './noveau-client';

describe('NoveauClient', () => {
  let component: NoveauClient;
  let fixture: ComponentFixture<NoveauClient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoveauClient]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoveauClient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
