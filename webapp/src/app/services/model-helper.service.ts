import { Injectable } from '@angular/core';
import { parseISO } from 'date-fns';
import { SessionRequestScheduled, SessionRequest, SessionRequestType } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ModelHelperService {

  // Utc string to Date object
  fixSessionRequestDateUtcToLocal(sessionRequest: SessionRequest): SessionRequest {
    if (sessionRequest.sessionType === SessionRequestType.Scheduled) {
      const sessionRequestScheduled = sessionRequest as SessionRequestScheduled;
      return Object.assign(sessionRequestScheduled, {
        start: parseISO(sessionRequestScheduled.start as any),
        end: parseISO(sessionRequestScheduled.end as any),
      });
    }
    return sessionRequest;
  }
}
