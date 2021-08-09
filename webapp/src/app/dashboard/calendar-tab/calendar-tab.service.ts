import { Injectable } from '@angular/core';
import { compareAsc, getDate, getMonth, getYear } from 'date-fns';
import { WorkoutSession } from '../models';

@Injectable()
export class CalendarTabService {
  getSessionsOfDay(date: Date, sessions: WorkoutSession[]): WorkoutSession[] {
    const dateWithoutTime = new Date(
      getYear(date),
      getMonth(date),
      getDate(date)
    );
    return sessions.filter((s) =>
      compareAsc(
        dateWithoutTime,
        new Date(getYear(s.start), getMonth(s.start), getDate(s.start))
      ) === 0
    );
  }
}
