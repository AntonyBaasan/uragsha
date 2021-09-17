import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionRequest } from 'src/app/models';
import { map } from 'rxjs/operators';
import { ModelHelperService } from '../model-helper.service';

@Injectable({
  providedIn: 'root',
})
export class SessionRequestsService {

  private endpoint: string = environment.webApiUrl + '/api/SessionRequest';

  constructor(private http: HttpClient, private modelHelperService: ModelHelperService) { }

  getAll(): Observable<Array<SessionRequest>> {
    return this.http.get<Array<SessionRequest>>(this.endpoint).pipe(
      map(sessionRequests => sessionRequests.map(s => this.modelHelperService.fixSessionRequestDateFormat(s)))
    );
  }

  create(sessionRequest: SessionRequest): Observable<SessionRequest> {
    return this.http.post<SessionRequest>(this.endpoint, sessionRequest).pipe(
      map(response =>  this.modelHelperService.fixSessionRequestDateFormat(response))
    );
  }

}
