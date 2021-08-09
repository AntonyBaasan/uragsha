import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallRoutingModule } from './call-routing.module';
import { CallPageComponent } from './call-page.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CallPageComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    CallRoutingModule
  ]
})
export class CallModule { }
