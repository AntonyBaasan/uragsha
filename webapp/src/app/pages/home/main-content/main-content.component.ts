import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import compareAsc from 'date-fns/compareAsc';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import formatDistance from 'date-fns/formatDistance';
import { SessionRequest, SessionRequestType } from 'src/app/models';
import { AuthService, DashboardDataService } from 'src/app/services';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {
  sessions: SessionRequest[] = [];

  constructor(
    private authService: AuthService,
    private dashboardDataService: DashboardDataService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.dashboardDataService.getComingSoon()
          .subscribe(sessionRequests => this.setSessionRequests(sessionRequests));
      } else {
        this.setSessionRequests([]);
      }
    });
  }

  private setSessionRequests(sessionRequests: SessionRequest[]) {
    this.sessions = sessionRequests;
    this.cdr.detectChanges();
  }

  isLoggedIn(){
    return this.authService.isLoggedIn();
  }


  // TODO: move to a service
  getDateTime(sessionRequest: SessionRequest): String {
    const currentTime = new Date();
    const startDate = new Date(sessionRequest.start);
    if (sessionRequest.sessionType === SessionRequestType.Instant) {
      return 'Active';
    }
    if (compareAsc(startDate, currentTime) === -1) {
      if (sessionRequest.sessionId) {
        return 'Active';
      } else {
        return 'Waiting';
      }
    }
    return formatDistance(startDate, currentTime); // 'MM/dd/yyyy'
  }

  // TODO: move to a service
  canJoin(sessionRequest: SessionRequest): boolean {
    const currentTime = new Date();
    const startDate = new Date(sessionRequest.start);
    if (sessionRequest.sessionType === SessionRequestType.Instant) {
      return true;
    }
    const startBeforeSec = differenceInSeconds(startDate, currentTime);
    if (startBeforeSec < 10 * 60) {
      return true;
    }
    return false;
  }

  join(sessionRequest: SessionRequest): void {
    this.router.navigate(['/call', sessionRequest.id]);
  }
}
