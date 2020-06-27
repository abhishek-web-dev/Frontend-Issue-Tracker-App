import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginPageComponent } from './login-page/login-page.component';
import { SignupPageComponent } from './signup-page/signup-page.component';
import { AppRoutingModule } from '../app-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutLoginPageComponent } from './layout-login-page/layout-login-page.component';
import { AboutPageComponent } from './about-page/about-page.component';


@NgModule({
  declarations: [LoginPageComponent, SignupPageComponent, LayoutLoginPageComponent, AboutPageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class LoginModule { }
