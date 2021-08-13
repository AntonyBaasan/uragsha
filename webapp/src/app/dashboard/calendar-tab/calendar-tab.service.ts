import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { addMinutes, compareAsc, getDate, getMonth, getYear, parseISO } from 'date-fns';
import { SessionRequest, SessionRequestStatus } from '../../models';
import { COLORS } from 'src/app/shared/colors';

@Injectable()
export class CalendarTabService {

  // Filter sessions by start date
  getSessionsOfDay(date: Date, sessions: SessionRequest[]): SessionRequest[] {
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

  createSessionRequestByStartDate(date: Date, userId: string) {
    const newSessionRequest: SessionRequest = {
      id: uuidv4(),
      start: date,
      end: addMinutes(date, 30),
      title: 'New Session',
      status: SessionRequestStatus.Waiting,
      userId: userId,
      color: COLORS.red,
    };
    return newSessionRequest;
  }
}
