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
  SessionRequests: SessionRequest[] = [];
  todaysWorkouts: SessionRequest[] = [];
  // subscriptions
  subSessionRequestsSubject: Subscription | undefined;

  constructor(
    private store: StoreService,
    private calendarTabService: CalendarTabService,
    private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subSessionRequestsSubject =
      this.store.SessionRequestsSubject.subscribe((sessions) => {
        this.SessionRequests = [...sessions];
        this.todaysWorkouts = this.calendarTabService.getSessionsOfDay(new Date(), [...sessions]);
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    if (this.subSessionRequestsSubject) {
      this.subSessionRequestsSubject.unsubscribe();
    }
  }

  insertSession(date: any) {
    this.store.insertSessionRequest(date);
  }

  removeSession(date: any) {
    this.store.removeSessionRequest(date);
  }
}
