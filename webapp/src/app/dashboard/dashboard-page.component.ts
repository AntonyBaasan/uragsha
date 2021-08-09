import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { CalendarTabService } from './calendar-tab/calendar-tab.service';
import { CalendarService } from './calendar-tab/calendar/calendar.service';
import { DashboardStore } from './dashboard.store';
import { SessionService } from './session/session.service';

const SERVICES = [
  SessionService,
  DashboardStore,
  CalendarService,
  CalendarTabService,
];

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  providers: [SERVICES],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent implements OnInit {
  constructor(
    private backendService: BackendService,
    private store: DashboardStore
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.backendService.getWorkoutSessions(new Date()).subscribe((sessions) => {
      this.store.setWorkoutSessions(sessions);
    });
  }
}
