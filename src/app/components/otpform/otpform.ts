import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormArray, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subject, combineLatest, takeUntil, debounceTime, map } from 'rxjs';

@Component({
  selector: 'app-otpform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otpform.html',
})
export class OtpForm implements OnInit, OnDestroy {
  @Output() otpSubmit = new EventEmitter<string>();
  @Output() resend = new EventEmitter<void>();

  readonly length = 6;
  otpForm!: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.otpForm = this.fb.group({
      digits: this.fb.array(
        Array.from({ length: this.length }, () =>
          this.fb.control('', [Validators.required, Validators.pattern(/^[0-9]$/)])
        )
      ),
    });
  }

  get digits(): FormArray {
    return this.otpForm.get('digits') as FormArray;
  }

  ngOnInit() {
    // Watch all digit changes reactively using RxJS
    const digitStreams = this.digits.controls.map((ctrl) => ctrl.valueChanges);
    combineLatest(digitStreams)
      .pipe(
        debounceTime(100), // wait briefly for fast typing
        map((values) => values.join('')),
        takeUntil(this.destroy$)
      )
      .subscribe((otp) => {
        // Auto-submit when all digits are filled
        if (otp.length === this.length && this.otpForm.valid) {
          this.emitOtp(otp);
        }
      });
  }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '').slice(-1);

    if (input.value && index < this.length - 1) {
      const next = input.nextElementSibling as HTMLInputElement;
      next?.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prev = input.previousElementSibling as HTMLInputElement;
      prev?.focus();
    }
  }

  submit() {
    if (this.otpForm.valid) {
      const otp = this.digits.value.join('');
      this.emitOtp(otp);
    } else {
      this.digits.controls.forEach((c) => c.markAsTouched());
    }
  }

  resendOtp() {
    this.resend.emit();
  }

  private emitOtp(otp: string) {
    console.log('OTP Submitted:', otp);
    this.otpSubmit.emit(otp);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
