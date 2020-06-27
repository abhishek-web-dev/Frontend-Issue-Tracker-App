import { Component, OnInit } from "@angular/core";
import { SharedService } from "src/app/shared/shared.service";
import { ToastrManager } from "ng6-toastr-notifications";
import { BaseURL } from "src/app/shared/base-url";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-detail-notif-page",
  templateUrl: "./detail-notif-page.component.html",
  styleUrls: ["./detail-notif-page.component.css"],
})
export class DetailNotifPageComponent implements OnInit {
  authToken: string;
  userName: String;
  allNotificationData: any = [];
  userId: string;
  notScrolly: boolean = true;
  notEmptyPost: boolean = true;
  pageNo: number = 0;

  button: boolean = true;
  change() {
    this.button = !this.button;
  }

  constructor(
    private _sharedService: SharedService,
    private _toastr: ToastrManager,
    private spinner: NgxSpinnerService
  ) {
    this.userId = localStorage.getItem("userId");
    this.authToken = localStorage.getItem("authToken");
    this.getTenNotification();
    this.spinner.show();
  }

  ngOnInit(): void {}

  onScroll() {
    if (this.notScrolly && this.notEmptyPost) {
      this.spinner.show();
      this.notScrolly = false;
      this.pageNo++;
      this.getTenNotification();
    }
  }

  //get ten notification
  getTenNotification = () => {
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "get/ten/notification", {
        authToken: this.authToken,
        userId: this.userId,
        skip: this.pageNo * 10,
      })
      .subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            const newPost = apiResponse.data;
            this.spinner.hide();
            if (newPost.length === 0) {
              this.notEmptyPost = false;
            }
            // add newly fetched posts to the existing post
            this.allNotificationData = this.allNotificationData.concat(newPost);
            this.notScrolly = true;
          } else {
            this.spinner.hide();
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
// if notification has already seen then, request will not send on server
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
              //this._toastr.successToastr(apiResponse.message, "Success");
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
