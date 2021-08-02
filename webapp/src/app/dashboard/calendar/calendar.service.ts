import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { WorkoutSession } from '../models';

@Injectable()
export class CalendarService {
  constructor() {}

  mapToCalendarEvent(
    workoutSessions: WorkoutSession[],
    actions: any /*EventAction[]*/
  ): CalendarEvent[] {
    return workoutSessions.map((s) => ({
      start: s.start,
      end: s.end,
      title: s.title,
      color: s.color,
      actions: actions,
      allDay: false,
      resizable: {
        beforeStart: false,
        afterEnd: false,
      },
      draggable: true,
    }));
  }
}
