import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionRequest } from '../../models';
import { CalendarTabService } from './calendar-tab.service';
import { SingnallingService, StoreService } from '../../services';

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
    private store: StoreService,
    private calendarTabService: CalendarTabService,
    private signallingService: SingnallingService,
    private cdr: ChangeDetectorRef) {}

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
    const request = this.calendarTabService.createSessionRequestByStartDate(date, this.store.getUserId());
    this.signallingService.createSessionRequest(request);
  }

  removeSession(id: string) {
    this.signallingService.deleteSessionRequest(id);
  }
}
