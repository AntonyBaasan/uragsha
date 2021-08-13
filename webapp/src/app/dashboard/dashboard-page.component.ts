import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Session, SessionRequest } from '../models';
import { BackendService, SingnallingService, StoreService } from '../services';
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

  constructor(
    private backendService: BackendService,
    private signallingService: SingnallingService,
    private store: StoreService
  ) {}

  ngOnInit(): void {
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
  }

  ngOnDestroy(): void {
    this.subOnGetUserSessionRequests?.unsubscribe();
    this.subOnSessionRequestUpdated?.unsubscribe();
  }

  setUserName() {
    this.store.setUserId(this.userName);
    this.signallingService.setUserName(this.store.getUserId());
  }

  saveDemoData() {
    this.backendService
      .createDemoSessionRequests(this.store.getUserId())
      .subscribe((sessions) => {
        sessions.forEach((s) => this.signallingService.CreateSessionRequest(s));
      });
  }

  fetchSessionRequests() {
    this.signallingService.GetUserSessionRequests(this.store.getUserId());
  }

  private handleOnSessionRequestUpdate(sessionRequest: SessionRequest): void {
    this.store.updateSessionRequest(sessionRequest);
  }
}
