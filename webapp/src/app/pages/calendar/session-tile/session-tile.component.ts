import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionRequestScheduled, SessionRequestStatus } from '../../../models';

@Component({
  selector: 'app-session-tile',
  templateUrl: './session-tile.component.html',
  styleUrls: ['./session-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class SessionTileComponent {
  @Input() sessionRequest: SessionRequestScheduled;
  @Input() canJoin: boolean;

  @Output() sessionEdit = new EventEmitter<Date>();
  @Output() sessionRemove = new EventEmitter<string>();
  @Output() sessionJoin = new EventEmitter<string>();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  formatDayAndTime() {
    // return format(session.start, 'HH:mm') +'-'+ format(session.end, 'HH:mm');
    return this.sessionRequest.start;
  }

  delete() {
    this.sessionRemove.emit(this.sessionRequest.id as string);
  }

  join() {
    this.sessionJoin.emit(this.sessionRequest.id as string);
  }

  getStatusText() {
    if (this.sessionRequest.status === SessionRequestStatus.Waiting) {
      return 'Waiting...';
    }
    if (this.sessionRequest.status === SessionRequestStatus.Scheduled) {
      return 'Scheduled';
    }
    return 'Unknown';
  }

  isJoinEnabled() {
    // return this.sessionRequest.status === SessionRequestStatus.Scheduled && this.sessionRequest.canJoin;
    // return this.sessionRequest.canJoin;
    return true;
  }
}
