import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionRequest } from 'src/app/models';
import { AuthService, DashboardDataService, SessionRequestDataService } from 'src/app/services';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit {
  sessionRequests: SessionRequest[] = [];

  constructor(
    private authService: AuthService,
    private dashboardDataService: DashboardDataService,
    private sessionRequestDataService: SessionRequestDataService,
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
    this.sessionRequests = sessionRequests;
    // adding fake session requests
    // this.sessionRequests.push({
    //   id: 'aaa',
    //   start: subMinutes(new Date(), 60),
    //   title: 'fake sessions 1',
    //   sessionType: SessionRequestType.Scheduled,
    // } as SessionRequest)
    // this.sessionRequests.push({
    //   id: 'bbb',
    //   start: addMinutes(new Date(), 60),
    //   title: 'fake sessions 2',
    //   sessionType: SessionRequestType.Scheduled,
    // } as SessionRequest)
    // this.sessionRequests.push({
    //   id: 'ccc',
    //   start: subMinutes(new Date(), 360),
    //   title: 'fake sessions 3',
    //   sessionType: SessionRequestType.Scheduled,
    //   sessionId: 'some session id'
    // } as SessionRequest)
    this.cdr.detectChanges();
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  schedule() {
    this.router.navigate(['/calendar']);
  }

  delete(sessionRequest: SessionRequest) {
    this.sessionRequestDataService.delete(sessionRequest.id)
      .subscribe(() => {
        const index = this.sessionRequests.findIndex(s=>s.id === sessionRequest.id);
        this.sessionRequests.splice(index, 1);
        this.cdr.detectChanges();
      });
  }

}
