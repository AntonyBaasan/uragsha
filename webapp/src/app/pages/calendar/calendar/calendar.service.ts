import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { SessionRequestScheduled } from '../../../models';

@Injectable()
export class CalendarService {
  constructor() { }

  mapToCalendarEvent(
    SessionRequests: SessionRequestScheduled[],
    actions: any /*EventAction[]*/
  ): CalendarEvent[] {
    return SessionRequests.map((s) => ({
      id: s.id,
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
