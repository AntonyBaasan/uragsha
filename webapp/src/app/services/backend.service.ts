import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Observable, of } from 'rxjs';
import { SessionRequest, SessionRequestStatus } from '../models';
import { COLORS } from '../shared/colors';
import {
  startOfDay,
  subDays,
  addDays,
  endOfMonth,
  addHours,
  addMinutes,
} from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor() {}

  ping() {
    return 'hello world';
  }

  createDemoSessionRequests(userId: string): Observable<SessionRequest[]> {
    let currentDate = new Date();
    if (currentDate.getMinutes() > 30) {
      currentDate = addHours(currentDate, 1);
      currentDate.setMinutes(0, 0);
    } else {
      currentDate.setMinutes(30, 0);
    }

    return of([
      {
        id: uuidv4(),
        start: currentDate,
        end: addMinutes(currentDate, 30),
        title: 'A 30 min event',
        userId: userId,
        status: SessionRequestStatus.Waiting,
        color: COLORS.red,
      },
      {
        id: uuidv4(),
        start: addHours(currentDate, 4),
        end: addHours(currentDate, 5),
        title: 'An 1 hour event',
        userId: userId,
        status: SessionRequestStatus.Waiting,
        color: COLORS.yellow,
      },
      {
        id: uuidv4(),
        start: subDays(endOfMonth(new Date()), 3),
        end: addDays(endOfMonth(new Date()), 3),
        title: 'A long event that spans 2 months',
        userId: userId,
        status: SessionRequestStatus.Waiting,
        color: COLORS.blue,
      },
      {
        id: uuidv4(),
        start: addHours(startOfDay(new Date()), 2),
        end: addHours(new Date(), 2),
        title: 'A draggable and resizable event',
        userId: userId,
        status: SessionRequestStatus.Waiting,
        color: COLORS.yellow,
      },
    ]);
  }
}
