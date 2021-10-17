import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginViewComponent } from './login-view/login-view.component';
import { HeaderComponent } from './header/header.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule],
  declarations: [LoginViewComponent, HeaderComponent],
  exports: [LoginViewComponent, HeaderComponent, CommonModule, FormsModule]
})
export class SharedModule { }
