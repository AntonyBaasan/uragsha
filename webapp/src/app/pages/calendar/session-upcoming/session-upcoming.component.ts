import {
  ChangeDetectionStrategy, Component, EventEmitter,
  Input, Output
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionRequestScheduled } from '../../../models';

@Component({
  selector: 'app-session-upcoming',
  templateUrl: './session-upcoming.component.html',
  styleUrls: ['./session-upcoming.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionUpcomingComponent {
  @Input() sessionRequests: SessionRequestScheduled[] = [];

  @Output() sessionInsert = new EventEmitter<Date>();
  @Output() sessionRemove = new EventEmitter<string>();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  formatDayAndTime(session: SessionRequestScheduled) {
    // return format(session.start, 'HH:mm') +'-'+ format(session.end, 'HH:mm');
    return session.start;
  }

  edit(session: SessionRequestScheduled) { }

  delete(session: SessionRequestScheduled) {
    this.sessionRemove.emit(session.id as string);
  }

  join(session: SessionRequestScheduled) {
    this.router.navigate(['/call', session.id]);
  }

  bookNew() { }
}
