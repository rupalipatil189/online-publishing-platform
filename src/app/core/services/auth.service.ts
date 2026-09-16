import { Injectable, signal } from '@angular/core';

import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

import { firebaseAuth } from '../config/firebase.config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = signal<User | null>(null);

  isLoggedIn = signal(false);

  // Firebase has completed the initial authentication check
  authInitialized = signal(false);

  constructor() {
    onAuthStateChanged(firebaseAuth, (user) => {
      this.currentUser.set(user);
      this.authInitialized.set(true);

      this.isLoggedIn.set(!!user);
    });
  }

  signup(email: string, password: string) {
    return createUserWithEmailAndPassword(firebaseAuth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(firebaseAuth, email, password);
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(firebaseAuth, provider);
  }

  logout() {
    return signOut(firebaseAuth);
  }
}
