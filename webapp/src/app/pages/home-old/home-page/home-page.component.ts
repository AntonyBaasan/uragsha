import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionRequest } from 'src/app/models';
import { AuthService, SessionRequestFactoryService, StoreService } from 'src/app/services';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  sessionRequests: SessionRequest[] = [];

  constructor(
    public authService: AuthService,
    private sessionRequestFactoryService: SessionRequestFactoryService,
    private storeService: StoreService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.storeService.SessionRequestsSubject.subscribe(sessionRequests => this.sessionRequests = sessionRequests);

    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.storeService.loadComingSoon();
      } else {
        this.storeService.setSessionRequests([]);
      }
    });
  }

  startIntstantSession() {
    const user = this.authService.currentUser;
    if (user.value) {
      const newInstantSessionRequest = this.sessionRequestFactoryService.createInstant(user.value.uid);
      this.storeService.insertSessionRequest(newInstantSessionRequest)
        .subscribe(sessionRequest => {
          this.startSessionCall(sessionRequest);
        });
    }
  }

  startSessionCall(sessionRequest: SessionRequest) {
    window.open('/#/call/' + sessionRequest.id, "_blank");
  }

  delete(sessionRequest: SessionRequest) {
    this.storeService.deleteSessionRequest(sessionRequest.id)
      .subscribe();
  }
}
