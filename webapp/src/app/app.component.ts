import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'webapp';
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
  private login(provider: any) {
    // const auth = getAuth();
    this.auth.signInWithPopup(provider);
  }
  logout() {
    this.auth.signOut();
  }
}
