import { Injectable } from '@angular/core';
import { differenceInSeconds } from 'date-fns';
import { BehaviorSubject } from 'rxjs';
import { SessionRequest, User } from '../models';
import { TimerService } from './timer.service';

@Injectable()
export class StoreService {
  private sessionRequests: SessionRequest[] = [];

  public SessionRequestsSubject = new BehaviorSubject<SessionRequest[]>([]);

  constructor(private timerService: TimerService) {
  }



  setSessionRequests(SessionRequests: SessionRequest[]) {
    this.clearTimers(this.sessionRequests);
    this.sessionRequests = SessionRequests;
    this.setupTimers(this.sessionRequests);
    this.SessionRequestsSubject.next(this.sessionRequests);
  }

  insertSessionRequest(sessionRequest: SessionRequest) {
    this.sessionRequests = [...this.sessionRequests, sessionRequest];
    this.setupTimers([sessionRequest]);
    this.SessionRequestsSubject.next(this.sessionRequests);
  }

  updateSessionRequest(sessionRequest: SessionRequest) {
    const index = this.sessionRequests.findIndex(s => s.id === sessionRequest.id);
    this.clearTimers([this.sessionRequests[index]]);
    this.sessionRequests.splice(index, 1, sessionRequest);
    this.setupTimers([sessionRequest]);
    this.sessionRequests = [...this.sessionRequests];
    this.SessionRequestsSubject.next(this.sessionRequests);
  }

  deleteSessionRequest(sessionRequestId: string) {
    const index = this.sessionRequests.findIndex(s => s.id === sessionRequestId);
    this.clearTimers([this.sessionRequests[index]]);
    this.sessionRequests.splice(index, 1);
    this.SessionRequestsSubject.next(this.sessionRequests);
  }

  private clearTimers(sessionRequests: SessionRequest[]) {
    sessionRequests.forEach(s => {
      this.timerService.stopTimer(s.id);
    });
  }

  private setupTimers(sessionRequests: SessionRequest[]) {
    sessionRequests.forEach(s => {
      const endIntervalSec = differenceInSeconds(s.end, new Date());
      const startIntervalSec = differenceInSeconds(s.start, new Date());
      if (endIntervalSec <= 0) {
        s.canJoin = false;
      }
      else if (startIntervalSec <= 300) {
        s.canJoin = true;
      } else {
        this.timerService.setTimer(s.id, startIntervalSec * 1000, false, () => {
          s.canJoin = true;
          this.SessionRequestsSubject.next([...this.sessionRequests]);
        });
      }
    });
  }
}
