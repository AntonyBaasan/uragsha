import { Injectable } from '@angular/core';
import { addMinutes } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { SessionRequestInstant, SessionRequestScheduled, SessionRequestStatus, SessionRequestType } from 'src/app/models';
import { COLORS } from 'src/app/shared/colors';

@Injectable({ providedIn: 'root' })
export class SessionRequestFactoryService {

  constructor() { }

  createScheduled(date: Date, userId: string): SessionRequestScheduled {
    return {
      id: uuidv4(),
      start: date,
      end: addMinutes(date, 30),
      title: 'New Session',
      sessionType: SessionRequestType.Scheduled,
      status: SessionRequestStatus.Waiting,
      userId: userId,
      color: COLORS.red,
      canJoin: false,
    };
  }

  createInstant(userId: string): SessionRequestInstant {
    return {
      id: uuidv4(),
      start: new Date(),
      title: 'New Instant Session',
      sessionType: SessionRequestType.Instant,
      status: SessionRequestStatus.Waiting,
      userId: userId,
      color: COLORS.red,
    };
  }

}
