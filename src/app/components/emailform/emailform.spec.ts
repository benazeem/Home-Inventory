import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Emailform } from './emailform';

describe('Emailform', () => {
  let component: Emailform;
  let fixture: ComponentFixture<Emailform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Emailform]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Emailform);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
