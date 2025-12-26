import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouveauCompte } from './nouveau-compte';

describe('NouveauCompte', () => {
  let component: NouveauCompte;
  let fixture: ComponentFixture<NouveauCompte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NouveauCompte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouveauCompte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
