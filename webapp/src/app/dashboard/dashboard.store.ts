import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { addMinutes, isEqual } from 'date-fns';
import { BehaviorSubject } from 'rxjs';
import { COLORS } from '../shared/colors';
import { WorkoutSession } from './models';

@Injectable()
export class DashboardStore {
  private workoutSessions: WorkoutSession[] = [];
  public workoutSessionsSubject = new BehaviorSubject<WorkoutSession[]>([]);

  setWorkoutSessions(workoutSessions: WorkoutSession[]) {
    this.workoutSessions = workoutSessions;
    this.workoutSessionsSubject.next(this.workoutSessions);
  }

  insertSession(date: Date) {
    const newSession: WorkoutSession = {
      id: uuidv4(),
      start: date,
      end: addMinutes(date, 30),
      title: 'New Session',
      color: COLORS.red,
    };
    this.workoutSessions.push(newSession);
    this.workoutSessionsSubject.next(this.workoutSessions);
  }

  removeSession(startDate: Date) {
    this.workoutSessions = this.workoutSessions.filter(
      (s) => !isEqual(s.start, startDate)
    );
    this.workoutSessionsSubject.next(this.workoutSessions);
  }
}
