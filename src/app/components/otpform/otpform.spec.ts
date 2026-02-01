import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Otpform } from './otpform';

describe('Otpform', () => {
  let component: Otpform;
  let fixture: ComponentFixture<Otpform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Otpform]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Otpform);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
