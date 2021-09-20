import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionRequest } from '../../models';
import { CalendarTabService } from './calendar-tab.service';
import { AuthService, SingnallingService, StoreService } from '../../services';
import { SessionRequestsService } from 'src/app/services/webapi/session-requests.service';

@Component({
  selector: 'app-calendar-tab',
  templateUrl: './calendar-tab.component.html',
  styleUrls: ['./calendar-tab.component.scss'],
})
export class CalendarTabComponent implements OnInit, OnDestroy {
  sessionRequests: SessionRequest[] = [];
  todaysWorkouts: SessionRequest[] = [];
  // subscriptions
  subSessionRequestsSubject: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private store: StoreService,
    private calendarTabService: CalendarTabService,
    private signallingService: SingnallingService,
    private sessionRequestService: SessionRequestsService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.subSessionRequestsSubject =
      this.store.SessionRequestsSubject.subscribe((sessions) => {
        this.sessionRequests = [...sessions];
        this.todaysWorkouts = this.calendarTabService.getSessionsClosest([...sessions]);
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
      this.sessionRequestService.create(request).subscribe(sessionRequest => {
        //returned value has ID with it.
        this.store.updateSessionRequest(sessionRequest);
      });
    }
  }

  removeSession(id: string) {
    this.sessionRequestService.delete(id).subscribe(() => {
      this.store.deleteSessionRequest(id);
    });
  }
}
