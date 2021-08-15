import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionRequest, SessionRequestStatus } from '../../../models';

@Component({
  selector: 'app-session-upcoming',
  templateUrl: './session-upcoming.component.html',
  styleUrls: ['./session-upcoming.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionUpcomingComponent implements OnInit {
  @Input() sessionRequests: SessionRequest[] = [];

  @Output() sessionInsert = new EventEmitter<Date>();
  @Output() sessionRemove = new EventEmitter<string>();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {}

  formatDayAndTime(session: SessionRequest) {
    // return format(session.start, 'HH:mm') +'-'+ format(session.end, 'HH:mm');
    return session.start;
  }

  edit(session: SessionRequest) {}

  delete(session: SessionRequest) {
    this.sessionRemove.emit(session.id as string);
  }

  join(session: SessionRequest) {
    this.router.navigate(['/call', session.id]);
  }

  bookNew() {}
}
