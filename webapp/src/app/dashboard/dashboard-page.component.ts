import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionRequest, SessionRequestScheduled } from '../models';
import { AuthService, SingnallingService, StoreService, SessionRequestsDataService } from '../services';
import { CalendarTabService } from './calendar-tab/calendar-tab.service';
import { CalendarService } from './calendar-tab/calendar/calendar.service';
import { SessionService } from './session/session.service';

const SERVICES = [SessionService, CalendarService, CalendarTabService];

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  providers: [SERVICES],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  userName: string = '';

  private subOnGetUserSessionRequests: Subscription | undefined;
  private subOnSessionRequestUpdated: Subscription | undefined;
  private subOnSessionRequestCreated: Subscription | undefined;
  private subOnSessionRequestDeleted: Subscription | undefined;

  constructor(
    public authService: AuthService,
    private signallingService: SingnallingService,
    private sessionRequestsDataService: SessionRequestsDataService,
    private store: StoreService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.userName = user && user.uid ? user.uid : '';
      if (this.userName) {
        this.loadSessionRequest();
      } else {
        this.clearSessionRequest();
      }
      this.cdr.detectChanges();
    });

    this.subOnGetUserSessionRequests =
      this.signallingService.OnGetUserSessionRequests.subscribe(
        (sessionRequests: SessionRequest[]) =>
          this.store.setSessionRequests(sessionRequests)
      );
    this.subOnSessionRequestUpdated =
      this.signallingService.OnSessionRequestUpdated.subscribe(
        (sessionRequest: SessionRequest) =>
          this.handleOnSessionRequestUpdate(sessionRequest)
      );
    this.subOnSessionRequestCreated =
      this.signallingService.OnSessionRequestCreated.subscribe(
        (sessionRequest: SessionRequest) =>
          this.handleOnSessionRequestCreated(sessionRequest)
      );
    this.subOnSessionRequestDeleted =
      this.signallingService.OnSessionRequestDeleted.subscribe(
        (sessionRequestId: string) =>
          this.handleOnSessionRequestDeleted(sessionRequestId)
      );
  }

  loadSessionRequest() {
    this.sessionRequestsDataService.getAllScheduled().subscribe(sessionRequests => {
      this.store.setSessionRequests(sessionRequests);
    })
  }

  clearSessionRequest() {
    this.store.setSessionRequests([]);
  }

  ngOnDestroy(): void {
    this.subOnGetUserSessionRequests?.unsubscribe();
    this.subOnSessionRequestUpdated?.unsubscribe();
    this.subOnSessionRequestCreated?.unsubscribe();
    this.subOnSessionRequestDeleted?.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }

  saveDemoData() {
    // reads demo data from backend service and save into DB using signalling
    // const user = this.store.getUser();
    // if (user) {
    //   this.backendService
    //     .createDemoSessionRequests(user.uid)
    //     .subscribe((sessions) => {
    //       sessions.forEach((s) => this.signallingService.createSessionRequest(s));
    //     });
    // }
  }

  private handleOnSessionRequestUpdate(sessionRequest: SessionRequest): void {
    this.store.updateSessionRequest(sessionRequest as SessionRequestScheduled);
  }

  private handleOnSessionRequestCreated(sessionRequest: SessionRequest): void {
    this.store.insertSessionRequest(sessionRequest as SessionRequestScheduled);
  }

  private handleOnSessionRequestDeleted(sessionRequestId: string): void {
    this.store.deleteSessionRequest(sessionRequestId);
  }
}
