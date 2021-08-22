import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { BehaviorSubject, Subject } from 'rxjs';
import { User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // public firebaseApp: FirebaseApp;
  public onLogin = new Subject<User>();
  public onLogout = new Subject();
  public currentUser: User | null = null;

  constructor(public auth: AngularFireAuth) {
    this.auth.authState.subscribe((user: firebase.User | null) => this.handleAuthState(user));
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  private async handleAuthState(user: firebase.User | null): Promise<void> {
    console.log(user);
    if (user) {
      const token = await user.getIdToken();
      this.onLogin.next({
        uid: user.uid,
        email: user.email,
         displayName: user.displayName,
         photoUrl: user.photoURL,
          token
      })
    } else {
      this.onLogout.next();
    }
  }

}
