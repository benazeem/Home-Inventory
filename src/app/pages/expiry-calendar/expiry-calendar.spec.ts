import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiryCalendar } from './expiry-calendar';

describe('ExpiryCalendar', () => {
  let component: ExpiryCalendar;
  let fixture: ComponentFixture<ExpiryCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpiryCalendar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpiryCalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
