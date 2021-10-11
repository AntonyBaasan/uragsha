import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionRequest, SessionRequestScheduled } from '../../models';
import { CalendarTabService } from './calendar-tab.service';
import { AuthService, SingnallingService, StoreService, SessionRequestsDataService } from '../../services';

@Component({
  selector: 'app-calendar-tab',
  templateUrl: './calendar-tab.component.html',
  styleUrls: ['./calendar-tab.component.scss'],
})
export class CalendarTabComponent implements OnInit, OnDestroy {
  sessionRequests: SessionRequestScheduled[] = [];
  todaysWorkouts: SessionRequestScheduled[] = [];
  // subscriptions
  subSessionRequestsSubject: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private store: StoreService,
    private calendarTabService: CalendarTabService,
    private signallingService: SingnallingService,
    private sessionRequestDataService: SessionRequestsDataService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subSessionRequestsSubject =
      this.store.SessionRequestsSubject.subscribe((sessions) => {
        this.sessionRequests = [...sessions] as SessionRequestScheduled[];
        this.todaysWorkouts = this.calendarTabService.getSessionsClosest([...sessions]) as SessionRequestScheduled[];
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    if (this.subSessionRequestsSubject) {
      this.subSessionRequestsSubject.unsubscribe();
    }
  }

  insertSession(date: any) {
    const user = this.authService.currentUser.getValue();
    if (user) {
      const request = this.calendarTabService.createSessionRequestByStartDate(date, user.uid);

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
}
