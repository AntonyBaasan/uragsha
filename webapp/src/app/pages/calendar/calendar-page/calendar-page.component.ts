import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionRequest, SessionRequestScheduled } from '../../../models';
import { CalendarPageService } from './calendar-page.service';
import { CalendarService } from '../calendar/calendar.service';
import { AuthService, SingnallingService, StoreService } from '../../../services';

const SERVICES = [CalendarService, CalendarPageService];

@Component({
  selector: 'app-calendar-page',
  templateUrl: './calendar-page.component.html',
  styleUrls: ['./calendar-page.component.scss'],
  providers: [...SERVICES]
})
export class CalendarPageComponent implements OnInit, OnDestroy {
  sessionRequests: SessionRequestScheduled[] = [];
  todaysWorkouts: SessionRequestScheduled[] = [];
  userName: string = '';

  // subscriptions
  private subSessionRequestsSubject: Subscription | undefined;
  private subOnGetUserSessionRequests: Subscription | undefined;
  private subOnSessionRequestUpdated: Subscription | undefined;
  private subOnSessionRequestCreated: Subscription | undefined;
  private subOnSessionRequestDeleted: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private store: StoreService,
    private calendarPageService: CalendarPageService,
    private signallingService: SingnallingService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.authService.currentUser.subscribe(user => {
      this.userName = user && user.uid ? user.uid : '';
      if (this.userName) {
        this.subscribeToStore();
        this.subscribeToSignallingEvents();
        this.loadSessionRequest();
      } else {
        this.ngOnDestroy();
        this.clearSessionRequest();
      }
      this.cdr.detectChanges();
    });

  }

  private subscribeToStore() {
    this.subSessionRequestsSubject =
      this.store.SessionRequestsSubject.subscribe((sessions) => {
        this.sessionRequests = [...sessions] as SessionRequestScheduled[];
        this.todaysWorkouts = this.calendarPageService.getSessionsClosest([...sessions]) as SessionRequestScheduled[];
        this.cdr.detectChanges();
      });
  }

  private subscribeToSignallingEvents() {
    this.subOnGetUserSessionRequests =
      this.signallingService.OnGetUserSessionRequests.subscribe(
        (sessionRequests: SessionRequest[]) =>
          this.store.setSessionRequests(sessionRequests)
      );
    this.subOnSessionRequestUpdated =
      this.signallingService.OnSessionRequestUpdated.subscribe(
        (sessionRequest: SessionRequest) =>
          this.handleOnSessionRequestUpdated(sessionRequest)
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

  ngOnDestroy(): void {
    this.subSessionRequestsSubject?.unsubscribe();
    this.subOnGetUserSessionRequests?.unsubscribe();
    this.subOnSessionRequestUpdated?.unsubscribe();
    this.subOnSessionRequestCreated?.unsubscribe();
    this.subOnSessionRequestDeleted?.unsubscribe();
  }

  insertSession(date: any) {
    const user = this.authService.currentUser.getValue();
    if (user) {
      const request = this.calendarPageService.createSessionRequestByStartDate(date, user.uid);
      this.store.insertSessionRequest(request).subscribe();
    }
  }

  removeSession(id: string) {
    this.store.deleteSessionRequest(id).subscribe();
  }

  loadSessionRequest() {
    this.store.loadAllScheduled();

  }

  clearSessionRequest() {
    this.store.setSessionRequests([]);
  }

  private handleOnSessionRequestUpdated(sessionRequest: SessionRequest): void {
    const index = this.sessionRequests.findIndex(s => s.id === sessionRequest.id);
    if (index !== -1) {
      this.sessionRequests.splice(index, 1, sessionRequest as SessionRequestScheduled);
      this.store.setSessionRequests(this.sessionRequests);
    }
  }

  private handleOnSessionRequestCreated(sessionRequest: SessionRequest): void {
    const index = this.sessionRequests.findIndex(s => s.id === sessionRequest.id);
    if (index !== -1) {
      this.sessionRequests.splice(index, 1, sessionRequest as SessionRequestScheduled);
    } else {
      this.sessionRequests.push(sessionRequest as SessionRequestScheduled);
    }

    this.store.setSessionRequests(this.sessionRequests);
  }

  private handleOnSessionRequestDeleted(sessionRequestId: string): void {
    const index = this.sessionRequests.findIndex(s => s.id === sessionRequestId);
    if (index !== -1) {
      this.sessionRequests.splice(index, 1);
      this.store.setSessionRequests(this.sessionRequests);
    }
  }
}
