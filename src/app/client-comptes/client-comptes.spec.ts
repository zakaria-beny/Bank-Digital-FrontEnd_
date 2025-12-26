import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientComptes } from './client-comptes';

describe('ClientComptes', () => {
  let component: ClientComptes;
  let fixture: ComponentFixture<ClientComptes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientComptes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientComptes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
