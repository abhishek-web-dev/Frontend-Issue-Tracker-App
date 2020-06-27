import { Component, OnInit, Inject } from "@angular/core";
import { SharedService } from "src/app/shared/shared.service";
import { BaseURL } from "src/app/shared/base-url";
import { ToastrManager } from "ng6-toastr-notifications";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-view-issue-page",
  templateUrl: "./view-issue-page.component.html",
  styleUrls: ["./view-issue-page.component.css"],
})
export class ViewIssuePageComponent implements OnInit {
  model: object;
  dialogData: any;

  constructor(
    private _sharedService: SharedService,
    private _toastr: ToastrManager,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.model = {
      authToken: localStorage.getItem("authToken"),
      queryId: data.queryId,
    };
    this.getOneQueryData();
  }

  ngOnInit(): void {}

  // get one query data
  getOneQueryData = () => {
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "get/one/query", this.model)
      .subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            this.dialogData = apiResponse.data[0];
          } else {
            this._toastr.errorToastr(apiResponse.message, "Error");
          }
        },
        (err) => {
          this._toastr.errorToastr(err.message, "Error");
        }
      );
  };
}
