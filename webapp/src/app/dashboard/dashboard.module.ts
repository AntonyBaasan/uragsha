import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPageComponent } from './dashboard-page.component';
import { CalendarComponent } from './calendar-tab/calendar/calendar.component';
import { SessionComponent } from './session/session.component';
import { FormsModule } from '@angular/forms';
import { SessionUpcomingComponent } from './calendar-tab/session-upcoming/session-upcoming.component';
import { CalendarTabComponent } from './calendar-tab/calendar-tab.component';
import { SessionTileComponent } from './calendar-tab/session-tile/session-tile.component';

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
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
})
export class DashboardModule {}
