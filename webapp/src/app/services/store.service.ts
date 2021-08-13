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

  insertSessionRequest(date: Date) {
    const newSessionRequest: SessionRequest = {
      id: uuidv4(),
      start: date,
      end: addMinutes(date, 30),
      title: 'New Session',
      status: SessionRequestStatus.Waiting,
      userId: this.getUserId(),
      color: COLORS.red,
    };
    this.sessionRequests.push(newSessionRequest);
    this.SessionRequestsSubject.next(this.sessionRequests);
  }

  removeSessionRequest(startDate: Date) {
    this.sessionRequests = this.sessionRequests.filter(
      (s) => !isEqual(s.start, startDate)
    );
    this.SessionRequestsSubject.next(this.sessionRequests);
  }

  updateSessionRequest(sessionRequest: SessionRequest) {
    this.sessionRequests = this.sessionRequests.filter(
      (s) => s.id === sessionRequest.id
    );
    this.sessionRequests = [...this.sessionRequests, sessionRequest];
  }
}
