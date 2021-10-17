import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogindRoutingModule } from './login-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { LoginPageComponent } from './login-page/login-page.component';

const COMPONENTS = [
  LoginPageComponent,
];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    SharedModule,
    LogindRoutingModule,
    FormsModule,
    CommonModule,
  ],
})
export class LoginModule { }
