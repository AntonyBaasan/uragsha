import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  logout() {
    this.authService.logout()
      .then(() => this.router.navigate(['/']));
  }

}
