import { Injectable } from '@angular/core';
import { parse, parseISO } from 'date-fns';
import { SessionRequest } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ModelHelperService  {

  // Utc string to Date object
  fixSessionRequestDateUtcToLocal(sessionRequest: SessionRequest): SessionRequest {
    return Object.assign(sessionRequest, {
      start: parseISO(sessionRequest.start as any),
      end: parseISO(sessionRequest.end as any),
    });
  }
}
