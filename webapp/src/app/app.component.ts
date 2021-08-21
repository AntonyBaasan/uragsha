import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, setPersistence, signInWithRedirect, inMemoryPersistence, GoogleAuthProvider } from "firebase/auth";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'webapp';
  constructor(public auth: AngularFireAuth) {
  }
  login() {
    var provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account"
    });
    // const auth = getAuth();
    this.auth.signInWithPopup(provider);
  }
  logout() {
    this.auth.signOut();
  }
}
