import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JWTinterceptors } from './jwtinterceptors';

describe('JWTinterceptors', () => {
  let component: JWTinterceptors;
  let fixture: ComponentFixture<JWTinterceptors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JWTinterceptors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JWTinterceptors);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
