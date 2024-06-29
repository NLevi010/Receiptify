import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { map } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore, private router: Router) {
    this.user$ = afAuth.authState;
  }

  async register(user: User) {
    const { email, password, firstName, lastName } = user;
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password!);
      const uid = userCredential.user?.uid;
      await this.db.collection('users').doc(uid).set({
        firstName,
        lastName,
        email
      });
      await userCredential.user?.updateProfile({ displayName: `${firstName} ${lastName}` });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }


  async login(email: string, password: string) {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  async logout() {
    await this.afAuth.signOut();
    await this.router.navigate(['/']);
  }

  isLoggedIn(): Observable<boolean> {
    return this.user$.pipe(map(user => !!user));
  }

  getCurrentUserIdObservable(): Observable<string | null> {
    return this.afAuth.authState.pipe(
      map(user => user ? user.uid : null)
    );
  }

  getCurrentUser(): Observable<firebase.User | null> {
    return this.user$;
  }
}
