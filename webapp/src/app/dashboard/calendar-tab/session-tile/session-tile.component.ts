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
  selector: 'app-session-tile',
  templateUrl: './session-tile.component.html',
  styleUrls: ['./session-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionTileComponent {
  @Input() sessionRequest: SessionRequest;

  @Output() sessionEdit = new EventEmitter<Date>();
  @Output() sessionRemove = new EventEmitter<string>();
  @Output() sessionJoin = new EventEmitter<string>();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

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

  canJoin(){
    return this.sessionRequest.status === SessionRequestStatus.Scheduled;
  }
}
