import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SessionRequest, User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private user: User;
  private sessionRequests: SessionRequest[] = [];

  public SessionRequestsSubject = new BehaviorSubject<SessionRequest[]>([]);

  setUser(user: User) {
    this.user = user;
  }
  getUser(): User {
    return this.user;
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
