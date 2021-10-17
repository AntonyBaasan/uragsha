import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { CalendarComponent } from './calendar-tab/calendar/calendar.component';
import { SessionComponent } from './session/session.component';
import { FormsModule } from '@angular/forms';
import { SessionUpcomingComponent } from './calendar-tab/session-upcoming/session-upcoming.component';
import { CalendarTabComponent } from './calendar-tab/calendar-tab.component';
import { SessionTileComponent } from './calendar-tab/session-tile/session-tile.component';
import { SharedModule } from '../../shared/shared.module';
import { StoreService, TimerService } from '../../services';

const COMPONENTS = [
  DashboardPageComponent,
  CalendarComponent,
  SessionComponent,
  SessionUpcomingComponent,
  CalendarTabComponent,
  SessionTileComponent,
];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    SharedModule,
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [StoreService, TimerService]
})
export class DashboardModule { }
