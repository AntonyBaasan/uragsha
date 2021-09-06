import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallRoutingModule } from './call-routing.module';
import { CallPageComponent } from './call-page.component';
import { FormsModule } from '@angular/forms';
import { MessagesComponent } from './messages/messages.component';
import { VideoComponent } from './video/video.component';
import { OptionsComponent } from './options/options.component';
import { TimerComponent } from './timer/timer.component';


@NgModule({
  declarations: [
    CallPageComponent,
    MessagesComponent,
    VideoComponent,
    OptionsComponent,
    TimerComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    CallRoutingModule
  ]
})
export class CallModule { }
