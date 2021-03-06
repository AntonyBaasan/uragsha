import { Injectable } from '@angular/core';
import { differenceInSeconds } from 'date-fns';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { NORMAL_SESSION_TIME_MIN, SessionRequest, SessionRequestScheduled, SessionRequestType, SESSION_BEFORE_MIN, User } from '../models';
import { TimerService } from './timer.service';
import { DashboardDataService } from './webapi/dashboard-data.service';
import { SessionRequestDataService } from './webapi/session-request-data.service';

@Injectable()
export class StoreService {
  private sessionRequests: SessionRequest[] = [];

  public SessionRequestsSubject = new BehaviorSubject<SessionRequest[]>([]);

  private timeOfSessionSec = NORMAL_SESSION_TIME_MIN * 60; // 30 min
  private timeBeforeSessionSec = SESSION_BEFORE_MIN * 60; // 10 min

  constructor(
    private sessionRequestDataService: SessionRequestDataService,
    private dashboardDataService: DashboardDataService,
    private timerService: TimerService
  ) { }

  loadComingSoon(): void {
    this.dashboardDataService.getComingSoon()
      .subscribe(sessionRequests => this.setSessionRequests(sessionRequests));
  }

  loadAllScheduled() {
    this.sessionRequestDataService.getAllScheduled().subscribe(sessionRequests => {
      this.setSessionRequests(sessionRequests);
    })
  }

  getSessionRuquestOtherUser(sessionRequestId: string): Observable<User | null> {
    return this.sessionRequestDataService.getOtherUser(sessionRequestId)
      .pipe(
        catchError(err => {
          console.log(err);
          return of(null);
        })
      );
  }

  setSessionRequests(SessionRequests: SessionRequest[]) {
    this.clearTimers(this.sessionRequests);
    this.sessionRequests = SessionRequests;
    this.setupTimers(this.sessionRequests);

    this.SessionRequestsSubject.next([...this.sessionRequests]);
  }

  insertSessionRequest(sessionRequest: SessionRequest): Observable<SessionRequest> {
    return this.sessionRequestDataService.create(sessionRequest)
      .pipe(
        tap(sessionRequest => {
          this.sessionRequests = [...this.sessionRequests, sessionRequest];
          this.setupTimers([sessionRequest]);
          this.SessionRequestsSubject.next(this.sessionRequests);
        })
      );
  }


  deleteSessionRequest(sessionRequestId: string) {
    return this.sessionRequestDataService.delete(sessionRequestId)
      .pipe(
        tap(() => {
          const index = this.sessionRequests.findIndex(s => s.id === sessionRequestId);
          this.clearTimers([this.sessionRequests[index]]);
          this.sessionRequests.splice(index, 1);
          this.SessionRequestsSubject.next(this.sessionRequests);
        })
      );
  }

  // updateSessionRequest(sessionRequest: SessionRequest) {
  //   const index = this.sessionRequests.findIndex(s => s.id === sessionRequest.id);
  //   this.clearTimers([this.sessionRequests[index]]);
  //   this.sessionRequests.splice(index, 1, sessionRequest);
  //   this.setupTimers([sessionRequest]);
  //   this.sessionRequests = [...this.sessionRequests];
  //   this.SessionRequestsSubject.next(this.sessionRequests);
  // }

  private clearTimers(sessionRequests: SessionRequest[]) {
    sessionRequests.forEach(s => {
      this.timerService.stopTimer(s.id);
    });
  }

  // sets up timer that changes CanJoin property of the Scheduled sessionRequest
  private setupTimers(sessionRequests: SessionRequest[]) {
    sessionRequests.forEach(s => {
      // ignore if it is not Scheduled sessionrequest
      if (s.sessionType !== SessionRequestType.Scheduled) { return; }

      const scheduledSessionRequest = s as SessionRequestScheduled;

      const endIntervalSec = differenceInSeconds(scheduledSessionRequest.end, new Date());
      const startIntervalSec = differenceInSeconds(scheduledSessionRequest.start, new Date());
      // already passed more than 30 min
      if (endIntervalSec <= -1 * this.timeOfSessionSec) {
        scheduledSessionRequest.canJoin = false;
        return;
      }
      // 5 min before start
      if (startIntervalSec <= this.timeBeforeSessionSec) {
        scheduledSessionRequest.canJoin = true;
        return;
      }
      // start timer that enables canJoin before 5 min
      this.timerService.setTimer(s.id, (startIntervalSec - this.timeBeforeSessionSec) * 1000, false, () => {
        scheduledSessionRequest.canJoin = true;
        this.SessionRequestsSubject.next([...this.sessionRequests]);
      });

    });
  }
}
