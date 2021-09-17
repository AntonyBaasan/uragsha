import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SessionRequest, User } from '../models';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private sessionRequests: SessionRequest[] = [];

  public SessionRequestsSubject = new BehaviorSubject<SessionRequest[]>([]);
  public userSubject = new BehaviorSubject<User | null>(null);

  setUser(user: User | null) {
    this.userSubject.next(user);
  }

  getUser() {
    return this.userSubject.getValue();
  }

  isLoggedIn(): boolean {
    return this.getUser() != null;
  }

  setSessionRequests(SessionRequests: SessionRequest[]) {
    this.sessionRequests = SessionRequests;
    this.SessionRequestsSubject.next(this.sessionRequests);
  }

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
