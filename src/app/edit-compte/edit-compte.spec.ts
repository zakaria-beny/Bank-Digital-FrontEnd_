import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCompte } from './edit-compte';

describe('EditCompte', () => {
  let component: EditCompte;
  let fixture: ComponentFixture<EditCompte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCompte]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCompte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
