import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SessionRequest } from 'src/app/models';
import { ModelHelperService } from '../model-helper.service';

@Injectable({ providedIn: 'root' })
export class DashboardDataService {

  private endpoint: string = environment.webApiUrl + '/api/dashboard';

  constructor(private http: HttpClient, private modelHelperService: ModelHelperService) { }

  getComingSoon(): Observable<Array<SessionRequest>> {
    return this.http.get<Array<SessionRequest>>(this.endpoint + '/comingsoon')
      .pipe(
        map(sessionRequests => sessionRequests.map(s => this.modelHelperService.fixSessionRequestDateUtcToLocal(s)))
      );
  }


}
