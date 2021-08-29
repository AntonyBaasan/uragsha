import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginPageComponent } from './login-page.component';
import { FormsModule } from '@angular/forms';
import { LoginViewComponent } from '../shared/login-view/login-view.component';


@NgModule({
  declarations: [
    LoginPageComponent,
    LoginViewComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
  ],
  exports: [
    LoginPageComponent
  ],
  // bootstrap: [LoginPageComponent]
})
export class LoginModule { }
