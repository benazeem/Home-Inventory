import { OtpService } from './../../services/otp';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  Lock,
  Mail,
  CheckCircle,
  Eye,
  EyeOff,
  Send,
  Loader2,
} from 'lucide-angular';
import { AuthService } from '../../services/auth';
import { OtpForm } from '../otpform/otpform';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-emailform',
  imports: [ReactiveFormsModule, LucideAngularModule, OtpForm],
  templateUrl: './emailform.html',
  styleUrl: './emailform.css',
})
export class EmailForm {
  @Input() mode: 'signup' | 'login' = 'signup';
  @Output() otpSend = new EventEmitter<boolean>(false);
  @Input() otpMode = signal(false);

  // Icons
  readonly Lock = Lock;
  readonly Mail = Mail;
  readonly CheckCircle = CheckCircle;
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly Send = Send;
  readonly Loader2 = Loader2;

  loading = signal(false);
  otpSent = signal(false);
  hidePassword = true;
  userEntry = { email: '', password: '' };

  constructor(
    private authService: AuthService,
    private router: Router,
    private otpService: OtpService,
    private userService: UserService
  ) {}

  // Reactive form controls
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(8)]);

  EmailForm = new FormGroup({
    email: this.email,
    password: this.password,
  });

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.email.valid && this.password.valid) {
      this.userEntry.email = this.email.value!;
      this.userEntry.password = this.password.value!;
      if (this.mode === 'login') {
        this.loading.set(true);
        this.loginWithEmail();
      }

      if (this.mode === 'signup') {
        this.sendOtp();
      }
    }
  }

  // --------------------
  // EMAIL LOGIN
  // --------------------

  async loginWithEmail() {
    const { email, password } = this.userEntry;
    console.log('Logging in with email:', email, password);
    if (!email || !password) {
      alert('Please enter a valid email and password.');
      return;
    }
    this.loading.set(true);
    this.authService.login(email, password).subscribe({
      next: (result) => {
        this.router.navigate(['/app/dashboard']);
        const user = this.userService.getUserInfo();
        if (!user) {
          this.userService.createUserProfile();
        }
      },
      error: (err) => {
        console.error('Email login error:', err);
        this.loading.set(false);
        alert(err?.message || 'Login failed');
      },
    });
  }

  // --------------------
  // EMAIL SIGNUP
  // --------------------

  async sendOtp() {
    this.loading.set(true);
    this.otpSend.emit(true);
    this.otpService
      .sendOtp(this.userEntry.email)
      .then(() => {
        this.otpSent.set(true);
        console.log('OTP sent to email!');
      })
      .catch((err) => {
        console.error('Email OTP error:', err);
        alert(err?.message || 'Failed to send OTP');
      })
      .finally(() => this.loading.set(false));
  }

  async verifyOtp(otp: string) {
    try {
      this.loading.set(true);
      await this.otpService.verifyOtpAndSignup(this.userEntry.email, this.userEntry.password, otp);
      this.otpSend.emit(true);
      this.router.navigate(['/app/dashboard']);
      const user = this.userService.getUserInfo();
      if (!user) {
        this.userService.createUserProfile();
      }
    } catch (err: any) {
      console.error('Verify email OTP failed:', err);
      alert(err?.message || 'OTP verification failed');
    } finally {
      this.loading.set(false);
    }
  }
  onOtpSubmit(otp: string) {
    this.verifyOtp(otp);
  }

  onOtpResend() {
    this.sendOtp();
    this.otpSend.emit(true);
  }

  handlePasswordReset() {
    const email = this.email.value;
    if (!email) {
      alert('Please enter your email to reset password.');
      return;
    }
    this.authService.resetPassword(email).subscribe({
      next: () => {
        alert('Password reset email sent. Please check your inbox.');
      },
      error: (err) => {
        console.error('Password reset error:', err);
        alert(err?.message || 'Failed to send password reset email.');
      },
    });
  }
}
