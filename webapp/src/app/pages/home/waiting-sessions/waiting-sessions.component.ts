import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import compareAsc from 'date-fns/compareAsc';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import formatDistance from 'date-fns/formatDistance'
import { SessionRequest, SessionRequestType } from 'src/app/models';

@Component({
  selector: 'app-waiting-sessions',
  templateUrl: './waiting-sessions.component.html',
  styleUrls: ['./waiting-sessions.component.scss']
})
export class WaitingSessionsComponent {

  @Input() sessionRequests: SessionRequest[];

  constructor(private router: Router) { }

  // TODO: move to a service
  getDateTime(sessionRequest: SessionRequest): String {
    const currentTime = new Date();
    const startDate = new Date(sessionRequest.start);
    if (sessionRequest.sessionType === SessionRequestType.Instant) {
      return 'Active';
    }
    if (compareAsc(startDate, currentTime) === -1) {
      if (sessionRequest.sessionId) {
        return 'Active';
      } else {
        return 'Matching'; //
      }
    }
    return formatDistance(startDate, currentTime); // 'MM/dd/yyyy'
  }

  // TODO: move to a service
  canJoin(sessionRequest: SessionRequest): boolean {
    const currentTime = new Date();
    const startDate = new Date(sessionRequest.start);
    if (sessionRequest.sessionType === SessionRequestType.Instant) {
      return true;
    }
    const startBeforeSec = differenceInSeconds(startDate, currentTime);
    if (startBeforeSec < 10 * 60) {
      return true;
    }
    return false;
  }

  join(sessionRequest: SessionRequest): void {
    this.router.navigate(['/call', sessionRequest.id]);
  }

  getTitle(sessionRequest: SessionRequest) {
    if (sessionRequest.sessionType === SessionRequestType.Instant) {
      return 'Instant session is ' + this.getDateTime(sessionRequest);
    } else {
      return sessionRequest.title + ' scheduled ' + this.getDateTime(sessionRequest);
    }
  }

}
