import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginPageComponent } from "./login/login-page/login-page.component";
import { SignupPageComponent } from "./login/signup-page/signup-page.component";
import { HomePageComponent } from "./dashboard/home-page/home-page.component";
import { AuthGuard } from "./login/auth.guard";
import { CreateIssuePageComponent } from "./dashboard/create-issue-page/create-issue-page.component";
import { EditIssuePageComponent } from "./dashboard/edit-issue-page/edit-issue-page.component";
import { LayoutPageComponent } from "./shared/layout-page/layout-page.component";
import { WatchlistPageComponent } from "./dashboard/watchlist-page/watchlist-page.component";
import { DetailNotifPageComponent } from "./dashboard/detail-notif-page/detail-notif-page.component";
import { LayoutLoginPageComponent } from "./login/layout-login-page/layout-login-page.component";
import { AboutPageComponent } from "./login/about-page/about-page.component";
import { PageNotFoundComponent } from "./dashboard/page-not-found/page-not-found.component";
import { ResolveGuard } from './login/resolve.guard';


const routes: Routes = [
  {
    path: "",
    component: LayoutLoginPageComponent,
    children: [
      { path: "", redirectTo: "login", pathMatch: "full" },
      { path: "login", component: LoginPageComponent },
      { path: "signup", component: SignupPageComponent },
      { path: "about", component: AboutPageComponent },
    ],
  },

  {
    path: "dashboard",
    canActivate: [AuthGuard],
    component: LayoutPageComponent,
    children: [
      {
        path: "",
        component: HomePageComponent,
        pathMatch: "full",
      },
      {
        path: "create/issue",
        component: CreateIssuePageComponent,
      },
      {
        path: "edit/issue/:queryId",
        component: EditIssuePageComponent,resolve: { queryData: ResolveGuard } 
      },
      {
        path: "watchlist",
        component: WatchlistPageComponent,
      },
      {
        path: "all/notifications",
        component: DetailNotifPageComponent,
      },
    ],
  },
  { path: "*", component: PageNotFoundComponent, pathMatch: "full" },
  { path: "**", component: PageNotFoundComponent, pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
