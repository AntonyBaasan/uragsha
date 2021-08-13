import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { SessionRequest } from '../../../models';

@Injectable()
export class CalendarService {
  constructor() {}

  mapToCalendarEvent(
    SessionRequests: SessionRequest[],
    actions: any /*EventAction[]*/
  ): CalendarEvent[] {
    return SessionRequests.map((s) => ({
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
