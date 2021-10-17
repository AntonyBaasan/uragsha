import { Injectable } from '@angular/core';
import { compareAsc, getDate, getMonth, getYear, subMinutes } from 'date-fns';
import { SessionRequestFactoryService } from 'src/app/services';
import { SessionRequest, SessionRequestScheduled, SessionRequestType } from '../../../models';

@Injectable()
export class CalendarPageService {

  constructor(private sessionRequestFactoryService: SessionRequestFactoryService) { }

  getSessionsClosest(sessions: SessionRequest[]): SessionRequest[] {
    if (!sessions || sessions.length === 0) {
      return [];
    }

    let scheduledSessions = sessions.filter(s => s.sessionType === SessionRequestType.Scheduled) as SessionRequestScheduled[];
    scheduledSessions = scheduledSessions.filter(s => s.start >= subMinutes(new Date(), 30))
      .sort((s1, s2) => (s1.start as any) - (s2.start as any));

    if (scheduledSessions.length > 0) {
      return this.getSessionsOfDay(scheduledSessions[0].start, scheduledSessions);
    }
    return [];
  }

  // Filter sessions by start date
  getSessionsOfDay(day: Date, sessions: SessionRequestScheduled[]): SessionRequestScheduled[] {
    const dateWithoutTime = new Date(getYear(day), getMonth(day), getDate(day));
    return sessions.filter(
      (s) =>
        compareAsc(
          dateWithoutTime,
          new Date(getYear(s.start), getMonth(s.start), getDate(s.start))
        ) === 0
    );
  }

  createSessionRequestByStartDate(date: Date, userId: string): SessionRequestScheduled {
    return this.sessionRequestFactoryService.createScheduled(date, userId);
  }
}
