import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Mail,
  Lock,
  Send,
  Key,
  CheckCircle,
  Phone,
  Loader2,
  User,
  MoveLeft,
} from 'lucide-angular';
import { NgxCountriesDropdownModule } from 'ngx-countries-dropdown';
import { AuthService } from '../../services/auth';
import { EmailForm } from '../../components/emailform/emailform';
import { Mobileform } from '../../components/mobileform/mobileform';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule,
    NgxCountriesDropdownModule,
    EmailForm,
    Mobileform,
  ],
  templateUrl: './login.html',
})
export class Login {
  // Mode toggle (email / mobile)
  loginMethod = signal<'email' | 'mobile'>('email');

  // Icons
  readonly Mail = Mail;
  readonly Phone = Phone;
  readonly Lock = Lock;
  readonly Send = Send;
  readonly Key = Key;
  readonly CheckCircle = CheckCircle;
  readonly Loader2 = Loader2;
  readonly User = User;
  readonly LeftArrow = MoveLeft;

  // States
  loggingIn = signal(false);
  otpSent = signal(false);

  constructor(private authService: AuthService, private router: Router) {}

  onSelectMethod(method: 'email' | 'mobile') {
    this.loginMethod.set(method);
  }

  handleBack() {
    this.otpSent.set(false);
  }

  // ----------------------------
  // Google Signin
  // ----------------------------
  onGoogleSignin() {
    this.authService.signinGoogle().subscribe({
      next: (userCredential) => {
        console.log('Google Signin successful:', userCredential.user.displayName);
        alert(`Welcome ${userCredential.user.displayName}`);
      },
      error: (error) => {
        console.error('Google Signin failed:', error);
      },
    });
  }
}
