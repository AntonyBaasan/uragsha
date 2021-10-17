import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ResultRoutingModule } from './result-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ResultPageComponent } from './result-page/result-page.component';

const COMPONENTS = [
  ResultPageComponent,
];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    SharedModule,
    ResultRoutingModule,
    FormsModule,
    CommonModule,
  ],
})
export class ResultModule { }
