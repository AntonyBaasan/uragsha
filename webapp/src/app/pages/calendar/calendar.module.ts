import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule as CM, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar/calendar.component';
import { FormsModule } from '@angular/forms';
import { SessionUpcomingComponent } from './session-upcoming/session-upcoming.component';
import { CalendarPageComponent } from './calendar-page/calendar-page.component';
import { SessionTileComponent } from './session-tile/session-tile.component';
import { SharedModule } from '../../shared/shared.module';
import { StoreService, TimerService } from '../../services';

const COMPONENTS = [
  CalendarComponent,
  SessionUpcomingComponent,
  CalendarPageComponent,
  SessionTileComponent,
];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    SharedModule,
    CommonModule,
    CalendarRoutingModule,
    FormsModule,
    CM.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [StoreService, TimerService]
})
export class CalendarModule { }
