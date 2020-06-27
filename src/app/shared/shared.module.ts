import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderPageComponent } from './header-page/header-page.component';
import { MaterialModule } from '../material/material.module';
import { LayoutPageComponent } from './layout-page/layout-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MomentModule } from 'ngx-moment';

@NgModule({
  declarations: [HeaderPageComponent, LayoutPageComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    NgbModule,
    MomentModule
  ],
  exports: [
    HeaderPageComponent
    
  ]
})
export class SharedModule { }
