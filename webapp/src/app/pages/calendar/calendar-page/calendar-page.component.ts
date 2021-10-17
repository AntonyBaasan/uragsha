import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionRequest, SessionRequestScheduled } from '../../../models';
import { CalendarPageService } from './calendar-page.service';
import { CalendarService } from '../calendar/calendar.service';
import { AuthService, SingnallingService, StoreService, SessionRequestDataService } from '../../../services';

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
    private sessionRequestDataService: SessionRequestDataService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subSessionRequestsSubject =
      this.store.SessionRequestsSubject.subscribe((sessions) => {
        this.sessionRequests = [...sessions] as SessionRequestScheduled[];
        this.todaysWorkouts = this.calendarPageService.getSessionsClosest([...sessions]) as SessionRequestScheduled[];
        this.cdr.detectChanges();
      });

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

      this.store.insertSessionRequest(request);
      this.sessionRequestDataService.create(request).subscribe(sessionRequest => {
        //returned value has ID with it.
        this.store.updateSessionRequest(sessionRequest as SessionRequestScheduled);
      });
    }
  }

  removeSession(id: string) {
    this.sessionRequestDataService.delete(id).subscribe(() => {
      this.store.deleteSessionRequest(id);
    });
  }

  loadSessionRequest() {
    this.sessionRequestDataService.getAllScheduled().subscribe(sessionRequests => {
      this.store.setSessionRequests(sessionRequests);
    })
  }

  clearSessionRequest() {
    this.store.setSessionRequests([]);
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
