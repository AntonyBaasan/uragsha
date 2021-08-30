import { Component } from '@angular/core';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrls: ['./login-view.component.scss']
})
export class LoginViewComponent {
  constructor(public auth: AuthService) {
  }
  isLoggedIn() {
    return this.auth.currentUser == null;
  }
  loginGoogle() {
    this.auth.loginGoogle();
  }
  loginFacebook() {
    this.auth.loginFacebook();
  }
  loginTwitter() {
    this.auth.loginTwitter();
  }
  logout() {
    this.auth.logout();
  }
}
