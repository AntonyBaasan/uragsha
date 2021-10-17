import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { FormsModule } from '@angular/forms';
import { StoreService, TimerService } from '../../services';
import { HomePageComponent } from './home-page/home-page.component';
import { MainContentComponent } from './main-content/main-content.component';
import { CallInstructionComponent } from './call-instruction/call-instruction.component';
import { IntroductionComponent } from './introduction/introduction.component';

const COMPONENTS = [
  HomePageComponent, MainContentComponent,
  CallInstructionComponent, IntroductionComponent
];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    SharedModule,
    CommonModule,
    HomeRoutingModule,
    FormsModule,
  ],
  providers: [StoreService, TimerService]
})
export class HomeModule { }