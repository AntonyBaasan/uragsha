import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPageComponent } from './dashboard-page.component';
import { CalendarComponent } from './calendar/calendar.component';
import { SessionComponent } from './session/session.component';

@NgModule({
  declarations: [DashboardPageComponent, CalendarComponent, SessionComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
})
export class DashboardModule {}
