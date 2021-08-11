import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Observable, of } from 'rxjs';
import { WorkoutSession } from '../dashboard/models';
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

  getWorkoutSessions(date: Date): Observable<WorkoutSession[]> {
    let currentDate = new Date();
    if (currentDate.getMinutes() > 30) {
      currentDate = addHours(currentDate, 1);
      currentDate.setMinutes(0, 0);
    }else{
      currentDate.setMinutes(30, 0);
    }

    return of([
      {
        id: uuidv4(),
        start: currentDate,
        end: addMinutes(currentDate, 30),
        title: 'A 30 min event',
        color: COLORS.red,
      },
      {
        id: uuidv4(),
        start: startOfDay(new Date()),
        end: addMinutes(new Date(), 30),
        title: 'An event with no end date',
        color: COLORS.yellow,
      },
      {
        id: uuidv4(),
        start: subDays(endOfMonth(new Date()), 3),
        end: addDays(endOfMonth(new Date()), 3),
        title: 'A long event that spans 2 months',
        color: COLORS.blue,
      },
      {
        id: uuidv4(),
        start: addHours(startOfDay(new Date()), 2),
        end: addHours(new Date(), 2),
        title: 'A draggable and resizable event',
        color: COLORS.yellow,
      },
    ]);
  }
}
