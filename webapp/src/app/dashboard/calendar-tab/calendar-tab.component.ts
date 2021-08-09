import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardStore } from '../dashboard.store';
import { WorkoutSession } from '../models';
import { CalendarTabService } from './calendar-tab.service';

@Component({
  selector: 'app-calendar-tab',
  templateUrl: './calendar-tab.component.html',
  styleUrls: ['./calendar-tab.component.scss'],
})
export class CalendarTabComponent implements OnInit, OnDestroy {
  workoutSessions: WorkoutSession[] = [];
  todaysWorkouts: WorkoutSession[] = [];
  // subscriptions
  subWorkoutSessionsSubject: Subscription | undefined;

  constructor(private store: DashboardStore, private calendarTabService: CalendarTabService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.subWorkoutSessionsSubject =
      this.store.workoutSessionsSubject.subscribe((sessions) => {
        this.workoutSessions = [...sessions];
        this.todaysWorkouts = this.calendarTabService.getSessionsOfDay(new Date(), [...sessions]);
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    if (this.subWorkoutSessionsSubject) {
      this.subWorkoutSessionsSubject.unsubscribe();
    }
  }

  insertSession(date: any) {
    this.store.insertSession(date);
  }

  removeSession(date: any) {
    this.store.removeSession(date);
  }
}
