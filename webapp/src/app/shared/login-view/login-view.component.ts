import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider } from "firebase/auth";

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.scss']
})
export class LoginViewComponent {
  constructor(public auth: AngularFireAuth) {
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
  logout() {
    this.auth.signOut();
  }
}
