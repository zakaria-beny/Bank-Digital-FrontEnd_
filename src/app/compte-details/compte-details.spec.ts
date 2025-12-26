import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompteDetails } from './compte-details';

describe('CompteDetails', () => {
  let component: CompteDetails;
  let fixture: ComponentFixture<CompteDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompteDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompteDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
