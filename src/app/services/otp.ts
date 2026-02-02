import { signInWithEmailAndPassword } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Injectable({ providedIn: 'root' })
export class OtpService {
  constructor(private functions: Functions) {}

  async sendOtp(email: string) {
    console.log('Email sent to backend:', email); // ✅ Called from OtpService
    const callable = httpsCallable(this.functions, 'sendOtp');
    try {
      const result = await callable({ email });
      console.log(result.data);
    } catch (err) {
      console.error('Callable error:', err);
      throw err;
    }
  }

  async verifyOtpAndSignup(email: string, password: string, otp: string) {
    const callable = httpsCallable(this.functions, 'verifyOtpAndSignup');
    return callable({ email, password, otp });
  }
}
