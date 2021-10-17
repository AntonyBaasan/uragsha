import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionRoutingModule } from './session-routing.module';
import { SessionPageComponent } from './session-page/session-page.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { StoreService, TimerService } from '../../services';

const COMPONENTS = [
  SessionPageComponent,
];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    SharedModule,
    CommonModule,
    SessionRoutingModule,
    FormsModule,
  ],
  providers: [StoreService, TimerService]
})
export class SessionModule { }
