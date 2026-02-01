import { RouterLink } from '@angular/router';
import { Component, signal, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Mail, Lock, Send, Key, CheckCircle, Phone, MoveLeft } from 'lucide-angular';
import { NgxCountriesDropdownModule } from 'ngx-countries-dropdown';
import { AuthService } from '../../services/auth';
import { OtpService } from '../../services/otp';
import { EmailForm } from '../../components/emailform/emailform';
import { Mobileform } from '../../components/mobileform/mobileform';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule,
    NgxCountriesDropdownModule,
    EmailForm,
    Mobileform,
  ],
  templateUrl: './signup.html',
})
export class Signup {
  // --------------------
  // Icons
  // --------------------
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly Lock = Lock;
  readonly Send = Send;
  readonly Key = Key;
  readonly CheckCircle = CheckCircle;
  readonly LeftArrow = MoveLeft;

  // --------------------
  // Signals
  // --------------------
  signupMethod = signal<'email' | 'mobile'>('email');
  otpStatus = signal(false);

  constructor(private authService: AuthService, private otpService: OtpService) {}

  // --------------------
  // Switch mode
  // --------------------
  onSelectMethod(method: 'email' | 'mobile') {
    this.signupMethod.set(method);
    this.otpStatus.set(false);
  }

  handleOtpStatus(status: boolean) {
    this.otpStatus.set(status);
  }

  handleBack(){
    this.otpStatus.set(false);
    
  }

  // --------------------
  // Google Signup
  // --------------------
  onGoogleSignup() {
    this.authService.signinGoogle().subscribe({
      next: (cred) => {
        console.log('Google Signup successful:', cred.user.displayName);
        alert(`Welcome ${cred.user.displayName}`);
      },
      error: (err) => {
        console.error('Google Signup failed:', err);
      },
    });
  }
}
