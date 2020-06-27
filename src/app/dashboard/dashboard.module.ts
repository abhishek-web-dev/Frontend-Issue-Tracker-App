import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomePageComponent } from './home-page/home-page.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { CreateIssuePageComponent } from './create-issue-page/create-issue-page.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ViewIssuePageComponent } from './view-issue-page/view-issue-page.component';
import { EditIssuePageComponent } from './edit-issue-page/edit-issue-page.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WatchlistPageComponent } from './watchlist-page/watchlist-page.component';
import { DetailNotifPageComponent } from './detail-notif-page/detail-notif-page.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from "ngx-spinner";
import { MomentModule } from 'ngx-moment';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


@NgModule({
  declarations: [
    HomePageComponent, 
    CreateIssuePageComponent, 
    ViewIssuePageComponent, 
    EditIssuePageComponent, 
    WatchlistPageComponent, 
    DetailNotifPageComponent, PageNotFoundComponent],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule,
    AngularEditorModule,
    NgbModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
    MomentModule
  ]
})
export class DashboardModule { }
