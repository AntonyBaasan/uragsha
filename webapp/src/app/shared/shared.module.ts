import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginViewComponent } from './login-view/login-view.component';

@NgModule({
  imports: [CommonModule],
  declarations: [LoginViewComponent],
  exports: [LoginViewComponent,
    CommonModule, FormsModule]
})
export class SharedModule { }
