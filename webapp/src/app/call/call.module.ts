import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallRoutingModule } from './call-routing.module';
import { CallPageComponent } from './call-page.component';


@NgModule({
  declarations: [
    CallPageComponent
  ],
  imports: [
    CommonModule,
    CallRoutingModule
  ]
})
export class CallModule { }
