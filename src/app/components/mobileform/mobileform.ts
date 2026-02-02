import { AuthService } from './../../services/auth';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecaptchaVerifier } from 'firebase/auth';
import { NgxCountriesDropdownModule } from 'ngx-countries-dropdown';
import { Loader2, LucideAngularModule, Send } from 'lucide-angular';
import { OtpForm } from '../otpform/otpform';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-mobileform',
  imports: [ReactiveFormsModule, NgxCountriesDropdownModule, LucideAngularModule, OtpForm],
  templateUrl: './mobileform.html',
  styleUrl: './mobileform.css',
})
export class Mobileform {
  @Input() otpMode = signal(false);
  @Output() otpSend = new EventEmitter<boolean>(false);

  readonly Send = Send;
  readonly Loader2 = Loader2;
  private confirmationResult: any;
  loading = signal(false);
  otpSent = signal(false);
  countryCode = '+91';
  recaptcha!: RecaptchaVerifier;

  mobile = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]);
  otp = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}

  ngAfterViewInit() {
    this.recaptcha = this.authService.recaptchaVerifier('recaptcha-container');
    this.recaptcha.render();
  }

  onCountryCodeChange(event: any) {
    this.countryCode = event.dialling_code;
  }

  async sendMobileOtp() {
    if (!this.mobile.valid) {
      alert('Please enter a valid mobile number.');
      return;
    }
    const phoneNumber = this.countryCode + this.mobile.value;
    console.log('Full number:', phoneNumber);
    this.loading.set(true);
    this.otpSend.emit(true);
    this.authService.signupMobile(phoneNumber, this.recaptcha).subscribe({
      next: (result) => {
        this.confirmationResult = result;
        this.otpSent.set(true);
      },
      error: (err) => {
        console.error('Send OTP error:', err);
        alert(err?.message || 'Failed to send OTP');
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  async verifyMobileOtp() {
    if (!this.otp) {
      alert('Enter OTP first');
      return;
    }
    try {
      this.loading.set(true);
      const userCredential = await this.confirmationResult.confirm(this.otp);
      console.log('Mobile login successful:', userCredential.user);
      this.router.navigate(['/app/dashboard']);
      this.mobile.reset();
      await this.userService.createUserProfile();
    } catch (err) {
      console.error('OTP verification failed', err);
      alert('OTP verification failed!');
    } finally {
      this.loading.set(false);
    }
  }

  onOtpSubmit(event: any) {
    this.otp = event;
    this.verify();
  }
  verify() {
    this.verifyMobileOtp();
  }
  onOtpResend(event: any) {
    this.sendMobileOtp();
  }
}
