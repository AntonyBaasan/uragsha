import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fi } from 'date-fns/locale';
import { SessionRequest, SessionRequestStatus } from '../../../models';

@Component({
  selector: 'app-session-upcoming',
  templateUrl: './session-upcoming.component.html',
  styleUrls: ['./session-upcoming.component.scss'],
})
export class SessionUpcomingComponent implements OnInit {
  @Input() SessionRequests: SessionRequest[] = [];
  @Output() sessionInserted = new EventEmitter<Date>();
  @Output() sessionRemoved = new EventEmitter<Date>();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {}

  formatDayAndTime(session: SessionRequest) {
    // return format(session.start, 'HH:mm') +'-'+ format(session.end, 'HH:mm');
    return session.start;
  }

  delete(session: SessionRequest) {
    this.sessionRemoved.emit(session.start);
  }

  // TODO: this doesn't work. Had to use template routerLink
  join(session: SessionRequest) {
    this.router.navigate(['/call', session.id]);
    // this.router.navigateByUrl('/call/'+session.id);
  }

  getStatusText(session: SessionRequest) {
    if (session.status === SessionRequestStatus.Waiting) {
      return 'Waiting...';
    }
    if (session.status === SessionRequestStatus.Scheduled) {
      return 'Scheduled...';
    }
    return 'Unknown';
  }
}
