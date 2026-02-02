import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc, updateDoc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  authState$: Observable<unknown>;

  constructor(private auth: Auth, private firestore: Firestore) {
    this.authState$ = authState(this.auth);
  }

  // ------------------------------------------------
  // CURRENT USER
  // ------------------------------------------------
  get currentUser() {
    return this.auth.currentUser;
  }

  // ------------------------------------------------
  // GET USER PROFILE STREAM
  // ------------------------------------------------
  getUserInfo(): Observable<any> | null {
    const user = this.currentUser;
    if (!user) return null;

    const userRef = doc(this.firestore, `UserData/${user.uid}`);
    return docData(userRef, { idField: 'id' });
  }

  // ------------------------------------------------
  // CREATE USER PROFILE (ONLY IF MISSING)
  // ------------------------------------------------
  async createUserProfile() {
    const user = this.currentUser;
    if (!user) return Promise.reject('No logged-in user');

    const userRef = doc(this.firestore, `UserData/${user.uid}`);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      return;
    }

    const userData = {
      id: user.uid,
      name: user.displayName || 'New User',
      email: user.email || null,
      mobile: user.phoneNumber || null,
      metadata: user.metadata || {},
    };

    console.log('Creating UserData:', userData);
    return setDoc(userRef, userData);
  }

  // ------------------------------------------------
  // UPDATE USER PROFILE
  // ------------------------------------------------
  updateUserInfo(data: any) {
    const user = this.currentUser;
    if (!user) return Promise.reject('No logged-in user');

    const userRef = doc(this.firestore, `UserData/${user.uid}`);
    return updateDoc(userRef, data);
  }
}
