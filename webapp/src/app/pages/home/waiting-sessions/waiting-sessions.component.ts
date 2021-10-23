import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import compareAsc from 'date-fns/compareAsc';
import differenceInSeconds from 'date-fns/differenceInSeconds';
import formatDistance from 'date-fns/formatDistance'
import { SessionRequest, SessionRequestStatus, SessionRequestType, User } from 'src/app/models';
import { SessionRequestDataService } from 'src/app/services';

@Component({
  selector: 'app-waiting-sessions',
  templateUrl: './waiting-sessions.component.html',
  styleUrls: ['./waiting-sessions.component.scss']
})
export class WaitingSessionsComponent {

  @Input() set sessionRequests(values: SessionRequest[]) {
    this._sesssionRequests = values;
    values.forEach(s => {
      this.loadOtherUser(s);
    });
  }
  @Output() deleteSessionRequest = new EventEmitter<SessionRequest>();


  _sesssionRequests: SessionRequest[] = [];
  // TODO: temp solution
  otherUsers: { [sessionRequestId: string]: string } = {};

  constructor(
    private sessionRequestDataService: SessionRequestDataService,
    private cdr: ChangeDetectorRef,
    private router: Router) { }

  // TODO: move to a service
  getDateTime(sessionRequest: SessionRequest): String {
    const currentTime = new Date();
    const startDate = new Date(sessionRequest.start);
    if (sessionRequest.sessionType === SessionRequestType.Instant) {
      return ' in progress';
    }
    if (compareAsc(startDate, currentTime) === -1) {
      return ' in progress';
    }
    return 'scheduled ' + formatDistance(startDate, currentTime); // 'MM/dd/yyyy'
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
    // this.router.navigate(['/call', sessionRequest.id]);
    window.open('/#/call/' + sessionRequest.id, "_blank");
  }

  getTitle(sessionRequest: SessionRequest) {
    if (sessionRequest.sessionType === SessionRequestType.Instant) {
      return 'Instant session is in progress';
    } else {
      return 'Session ' + this.getDateTime(sessionRequest);
    }
  }

  private loadOtherUser(sessionRequest: SessionRequest) {
    this.sessionRequestDataService.getOtherUser(sessionRequest.id)
      .subscribe(
        (otherUser: User) => {
          if (otherUser?.displayName) {
            this.otherUsers[sessionRequest.id] = otherUser.displayName;
            this.cdr.detectChanges();
          }
        });
  }

  // // TODO: will refactor! can't call server like this
  getOtherUser(sessionRequest: SessionRequest) {
    if (this.otherUsers[sessionRequest.id]) {
      return 'with ' + this.otherUsers[sessionRequest.id];
    }

    // not matched yet
    return '(matching...)';
  }

  delete(sessionRequest: SessionRequest) {
    this.deleteSessionRequest.emit(sessionRequest);
    this.sessionRequestDataService.delete(sessionRequest.id)
      .subscribe(() => this.cdr.detectChanges());
  }

}
