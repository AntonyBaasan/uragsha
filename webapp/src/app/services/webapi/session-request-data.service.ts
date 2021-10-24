import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SessionRequestScheduled, SessionRequest, User } from 'src/app/models';
import { ModelHelperService } from '../model-helper.service';
import { SessionRequestComment } from 'src/app/models/dto/SessionRequestComment';

@Injectable({ providedIn: 'root' })
export class SessionRequestDataService {

  private endpoint: string = environment.webApiUrl + '/api/SessionRequest';

  constructor(private http: HttpClient, private modelHelperService: ModelHelperService) { }

  getAllScheduled(): Observable<Array<SessionRequestScheduled>> {
    return this.http.get<Array<SessionRequestScheduled>>(this.endpoint)
      .pipe(
        map(sessionRequests => sessionRequests.map(s => this.modelHelperService.fixSessionRequestDateUtcToLocal(s) as SessionRequestScheduled))
      );
  }

  get(sessionRequestId: string) {
    return this.http.get<SessionRequest>(this.endpoint + '/' + sessionRequestId)
      .pipe(
        map(sessionRequest => this.modelHelperService.fixSessionRequestDateUtcToLocal(sessionRequest))
      );
  }

  getOtherUser(sessionRequestId: string) {
    return this.http.get<User>(this.endpoint + '/' + sessionRequestId + '/session/otheruser');
  }

  getComment(sessionRequestId: string) {
    return this.http.get<SessionRequestComment>(this.endpoint + '/' + sessionRequestId + '/comment/');
  }

  setComment(comment: SessionRequestComment) {
    return this.http.post<SessionRequestComment>(this.endpoint + '/' + comment.givenSessionRequestId + '/comment', comment);
  }

  create(sessionRequest: SessionRequest): Observable<SessionRequest> {
    return this.http.post<SessionRequest>(this.endpoint, sessionRequest)
      .pipe(
        map(sessionRequest => this.modelHelperService.fixSessionRequestDateUtcToLocal(sessionRequest))
      );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(this.endpoint + '/' + id);
  }

}
