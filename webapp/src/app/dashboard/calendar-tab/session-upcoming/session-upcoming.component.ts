import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutSession } from '../../models';

@Component({
  selector: 'app-session-upcoming',
  templateUrl: './session-upcoming.component.html',
  styleUrls: ['./session-upcoming.component.scss'],
})
export class SessionUpcomingComponent implements OnInit {
  @Input() workoutSessions: WorkoutSession[] = [];
  @Output() sessionInserted = new EventEmitter<Date>();
  @Output() sessionRemoved = new EventEmitter<Date>();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {}

  formatDayAndTime(session: WorkoutSession) {
    // return format(session.start, 'HH:mm') +'-'+ format(session.end, 'HH:mm');
    return session.start;
  }

  delete(session: WorkoutSession) {
    this.sessionRemoved.emit(session.start);
  }

  // TODO: this doesn't work. Had to use template routerLink
  join(session: WorkoutSession) {
    // this.router.navigate(['/call/'+session.id]);
    this.router.navigateByUrl('/call/'+session.id);
  }
}
