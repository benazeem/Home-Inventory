import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mobileform } from './mobileform';

describe('Mobileform', () => {
  let component: Mobileform;
  let fixture: ComponentFixture<Mobileform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mobileform]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mobileform);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
