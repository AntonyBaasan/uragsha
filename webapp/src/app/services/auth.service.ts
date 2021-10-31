import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FacebookAuthProvider, GoogleAuthProvider, TwitterAuthProvider } from 'firebase/auth';
import firebase from 'firebase/compat/app';
import { BehaviorSubject, Subject } from 'rxjs';
import { User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {

  public currentUser = new BehaviorSubject<User | null>(null);

  constructor(public auth: AngularFireAuth) {
    this.auth.authState.subscribe((user: firebase.User | null) => this.handleAuthState(user));
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  isLoggedIn(): boolean {
    return this.currentUser.getValue() != null;
  }

  loginGoogle() {
    var provider = new GoogleAuthProvider();
    // force to select an account, otherwise will login automatically
    provider.setCustomParameters({
      prompt: "select_account"
    });
    this.login(provider);
  }
  loginFacebook() {
    var provider = new FacebookAuthProvider();
    // force reauthenticate, otherwise will login automatically
    provider.setCustomParameters({ auth_type: 'reauthenticate' })
    provider.addScope('public_profile,email');
    this.login(provider);
  }

  loginTwitter() {
    var provider = new TwitterAuthProvider();
    this.login(provider);
  }

  private login(provider: any) {
    // this.auth.signInWithPopup(provider);
    this.auth.signInWithRedirect(provider);
  }

  logout(): Promise<void> {
    return this.auth.signOut();
  }

  private async handleAuthState(user: firebase.User | null): Promise<void> {
    console.log(user);
    if (user) {
      const token = await user.getIdToken();
      this.currentUser.next({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoUrl: user.photoURL,
        token
      })
    } else {
      this.currentUser.next(null);
    }
  }

}
