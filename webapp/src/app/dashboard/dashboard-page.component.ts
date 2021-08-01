import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SessionService } from './session/session.service';

const SERVICES = [SessionService];

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  providers: [SERVICES],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
