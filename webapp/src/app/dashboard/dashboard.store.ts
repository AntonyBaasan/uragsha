import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { WorkoutSession } from './models';

@Injectable()
export class DashboardStore {
  private workoutSessions: WorkoutSession[] = [];
  public workoutSessionsSubject = new BehaviorSubject<WorkoutSession[]>([]);

  setWorkoutSessions(workoutSessions: WorkoutSession[]) {
    this.workoutSessions = workoutSessions;
    this.workoutSessionsSubject.next(this.workoutSessions);
  }
}
