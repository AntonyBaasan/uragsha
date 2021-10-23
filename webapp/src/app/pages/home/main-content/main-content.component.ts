import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SessionRequest } from 'src/app/models';
import { AuthService, StoreService } from 'src/app/services';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent {

  @Input() sessionRequests: SessionRequest[] = [];
  @Output() goToSessionCall = new EventEmitter<SessionRequest>();
  @Output() deleteSessionRequest = new EventEmitter<SessionRequest>();

  constructor(
    private authService: AuthService,
    private storeService: StoreService,
    private router: Router,
  ) { }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  schedule() {
    this.router.navigate(['/calendar']);
  }

}
