import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  sendPasswordResetEmail,
  signOut,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  ConfirmationResult,
  RecaptchaVerifier,
  authState,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  authState$: Observable<unknown>;

  constructor(private auth: Auth) {
    this.authState$ = authState(this.auth);
  }

  recaptchaVerifier(containerId: string): RecaptchaVerifier {
    return new RecaptchaVerifier(this.auth, containerId, {
      size: 'invisible', // 'invisible' for invisible and normal for visible reCAPTCHA
      callback: (response: any) => {
        console.log('reCAPTCHA solved!', response);
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired. Solve again.');
      },
    });
  }

  signup(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  signupMobile(
    phoneNumber: string,
    appVerifier: RecaptchaVerifier
  ): Observable<ConfirmationResult> {
    return from(signInWithPhoneNumber(this.auth, phoneNumber, appVerifier));
  }

  signinGoogle(): Observable<UserCredential> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
  }

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  resetPassword(email: string): Observable<void> {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  get currentUser() {
    return this.auth.currentUser;
  }
}
