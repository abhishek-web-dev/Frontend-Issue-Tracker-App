import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BaseURL } from "../base-url";
import { SharedService } from "../shared.service";
import { ToastrManager } from "ng6-toastr-notifications";

@Component({
  selector: "app-header-page",
  templateUrl: "./header-page.component.html",
  styleUrls: ["./header-page.component.css"],
})
export class HeaderPageComponent implements OnInit {
  authToken: string;
  userName: String;
  allNotificationData: any;
  userId: string;
  unReadNotif:number = 0;

  constructor(
    public dialog: MatDialog,
    private _sharedService: SharedService,
    private _toastr: ToastrManager
  ) {
    this.userId = localStorage.getItem("userId");
    this.authToken = localStorage.getItem("authToken");
    // get all notification
    this.getAllNotification();
  }

  ngOnInit(): void {
    this.userName =
      localStorage.getItem("name").charAt(0).toUpperCase() +
      localStorage.getItem("name").slice(1);
  }

  // logout method
  logout = () => {
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "logout", {
        authToken: this.authToken,
      })
      .subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            localStorage.clear();
          } else {
            this._toastr.errorToastr(apiResponse.message, "Error");
          }
        },
        (err) => {
          this._toastr.errorToastr(err.message, "Error");
        }
      );
  };

  //get all notification method
  getAllNotification = () => {
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "get/all/notification", {
        authToken: this.authToken,
        userId: this.userId,
      })
      .subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            this.allNotificationData = apiResponse.data;
            this.unReadNotif = 0 ;
            this.allNotificationData.map((item)=>{
              item.userWatchlistIds.map((obj)=>{
                if(!obj.seen && this.userId === obj.userId){
                   this.unReadNotif++;
                }
              });
                  
            });
          } else {
            this._toastr.errorToastr(apiResponse.message, "Error");
          }
        },
        (err) => {
          this._toastr.errorToastr(err.message, "Error");
        }
      );
  };

  // mark notification seen
  markSeenNoti = (
    notificationId: string,
    userWatchlistIds: [{ userId: string; seen: boolean }]
  ) => {
    let seen: boolean;
    for (let i = 0; i < userWatchlistIds.length; i++) {
      if (this.userId === userWatchlistIds[i].userId) {
        seen = userWatchlistIds[i].seen;
        break;
      }
    }

    if (!seen) {
      let model = {
        authToken: this.authToken,
        userId: this.userId,
        notificationId: notificationId,
      };
      this._sharedService
        .post(BaseURL.BASE_USER_ENDPOINT + "edit/notification", model)
        .subscribe(
          (apiResponse) => {
            if (apiResponse.status === 200) {
              this.getAllNotification();
            } else {
              this._toastr.errorToastr(apiResponse.message, "Error");
            }
          },
          (err) => {
            this._toastr.errorToastr(err.message, "Error");
          }
        );
    }
  };
}
