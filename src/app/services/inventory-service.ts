import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  collectionData,
} from '@angular/fire/firestore';
import { AuthService } from './auth'; 

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  private get userId() {
    return this.authService.currentUser?.uid;
  }

  // 📌 GET all items
  getItems() {
    const uid = this.userId;
    if (!uid) return;

    const ref = collection(this.firestore, `UserData/${uid}/inventory`);
    return collectionData(ref, { idField: 'id' });
  }

  // 📌 ADD item (auto ID)
  setItem(data: any) {
    const uid = this.userId;
    if (!uid) return;

    const ref = collection(this.firestore, `UserData/${uid}/inventory`);
    return addDoc(ref, data);
  }

  // 📌 UPDATE item
  updateItem(id: string, data: any) {
    const uid = this.userId;
    if (!uid) return;

    const ref = doc(this.firestore, `UserData/${uid}/inventory/${id}`);
    return updateDoc(ref, data);
  }

  // 📌 DELETE item
  deleteItem(id: string) {
    const uid = this.userId;
    if (!uid) return;

    const ref = doc(this.firestore, `UserData/${uid}/inventory/${id}`);
    return deleteDoc(ref);
  }
}
