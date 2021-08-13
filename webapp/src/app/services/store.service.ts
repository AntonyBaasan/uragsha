import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { addMinutes, isEqual, isThisISOWeek } from 'date-fns';
import { BehaviorSubject, Subject } from 'rxjs';
import { COLORS } from '../shared/colors';
import { SessionRequest, Session, SessionRequestStatus } from '../models';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private userId: string = '';
  private sessionRequests: SessionRequest[] = [];

  public SessionRequestsSubject = new BehaviorSubject<SessionRequest[]>([]);

  setUserId(userId: string) {
    this.userId = userId;
  }
  getUserId() {
    return this.userId;
  }

  setSessionRequests(SessionRequests: SessionRequest[]) {
    this.sessionRequests = SessionRequests;
    this.SessionRequestsSubject.next(this.sessionRequests);
  }

  // removeSessionRequest(startDate: Date) {
  //   this.sessionRequests = this.sessionRequests.filter(
  //     (s) => !isEqual(s.start, startDate)
  //   );
  //   this.SessionRequestsSubject.next(this.sessionRequests);
  // }

  insertSessionRequest(sessionRequest: SessionRequest) {
    this.sessionRequests = [...this.sessionRequests, sessionRequest];
    this.SessionRequestsSubject.next(this.sessionRequests);
  }

  updateSessionRequest(sessionRequest: SessionRequest) {
    const index = this.sessionRequests.findIndex(
      (s) => s.id === sessionRequest.id
    );
    this.sessionRequests.splice(index, 1, sessionRequest);
    this.sessionRequests = [...this.sessionRequests];
    this.SessionRequestsSubject.next(this.sessionRequests);
  }

  deleteSessionRequest(sessionRequestId: string) {
    this.sessionRequests = this.sessionRequests.filter(
      (s) => s.id !== sessionRequestId
    );
    this.SessionRequestsSubject.next(this.sessionRequests);
  }
}
