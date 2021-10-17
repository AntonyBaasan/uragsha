import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallRoutingModule } from './call-routing.module';
import { CallPageComponent } from './call-page.component';
import { FormsModule } from '@angular/forms';
import { MessagesComponent } from './messages/messages.component';
import { VideoComponent } from './video/video.component';
import { OptionsComponent } from './options/options.component';
import { TimerComponent } from './timer/timer.component';
import { StoreService, TimerService } from '../../services';
import { WorkoutEditorComponent } from './workout-editor/workout-editor.component';
import { WorkoutPlayerComponent } from './workout-player/workout-player.component';


@NgModule({
  declarations: [
    CallPageComponent,
    MessagesComponent,
    VideoComponent,
    OptionsComponent,
    TimerComponent,
    WorkoutEditorComponent,
    WorkoutPlayerComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    CallRoutingModule
  ],
  providers: [StoreService, TimerService]
})
export class CallModule { }
