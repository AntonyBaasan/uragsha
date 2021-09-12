import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionRequest } from '../models';
import { AuthService, BackendService, SingnallingService, StoreService } from '../services';
import { SessionRequestsService } from '../services/webapi/session-requests.service';
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
    private backendService: BackendService,
    private signallingService: SingnallingService,
    private sessionRequestsService: SessionRequestsService,
    private store: StoreService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.store.userSubject.subscribe(user => {
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
    this.sessionRequestsService.getAll().subscribe(sessionRequests => {
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

  getLoginButton() {
    const user = this.store.userSubject.getValue();
    if (user) { return user.displayName; }
    return 'Sign In';
  }

  logout() {
    this.authService.logout();
  }

  saveDemoData() {
    // reads demo data from backend service and save into DB using signalling
    const user = this.store.getUser();
    if (user) {
      this.backendService
        .createDemoSessionRequests(user.uid)
        .subscribe((sessions) => {
          sessions.forEach((s) => this.signallingService.createSessionRequest(s));
        });
    }
  }

  fetchAllSessionRequests() {
    this.signallingService.getUserSessionRequests();
  }

  private handleOnSessionRequestUpdate(sessionRequest: SessionRequest): void {
    this.store.updateSessionRequest(sessionRequest);
  }

  private handleOnSessionRequestCreated(sessionRequest: SessionRequest): void {
    this.store.insertSessionRequest(sessionRequest);
  }

  private handleOnSessionRequestDeleted(sessionRequestId: string): void {
    this.store.deleteSessionRequest(sessionRequestId);
  }
}
