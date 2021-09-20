import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import {
  addMinutes,
  compareAsc,
  getDate,
  getMonth,
  getYear,
  isEqual,
} from 'date-fns';
import { SessionRequest, SessionRequestStatus } from '../../models';
import { COLORS } from 'src/app/shared/colors';

@Injectable()
export class CalendarTabService {
  getSessionsClosest(sessions: SessionRequest[]): SessionRequest[] {
    if (!sessions || sessions.length === 0) {
      return [];
    }
    sessions = sessions.sort((s1, s2) => (s1.start as any) - (s2.start as any));

    return this.getSessionsOfDay(sessions[0].start, sessions);
  }

  // Filter sessions by start date
  getSessionsOfDay(day: Date, sessions: SessionRequest[]): SessionRequest[] {
    const dateWithoutTime = new Date(getYear(day), getMonth(day), getDate(day));
    return sessions.filter(
      (s) =>
        compareAsc(
          dateWithoutTime,
          new Date(getYear(s.start), getMonth(s.start), getDate(s.start))
        ) === 0
    );
  }

  createSessionRequestByStartDate(date: Date, userId: string) {
    const newSessionRequest: SessionRequest = {
      id: uuidv4(),
      start: date,
      end: addMinutes(date, 30),
      title: 'New Session',
      status: SessionRequestStatus.Waiting,
      userId: userId,
      color: COLORS.red,
      canJoin: false,
    };
    return newSessionRequest;
  }
}
