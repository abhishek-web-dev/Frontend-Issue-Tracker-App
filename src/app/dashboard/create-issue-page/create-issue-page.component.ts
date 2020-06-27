import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrManager } from "ng6-toastr-notifications";
import { Router } from "@angular/router";
import { SharedService } from "src/app/shared/shared.service";
import { BaseURL } from "src/app/shared/base-url";
import { AngularEditorConfig } from "@kolkov/angular-editor";

export interface allUsersId {
  userId: string;
  name: string;
}

@Component({
  selector: "app-create-issue-page",
  templateUrl: "./create-issue-page.component.html",
  styleUrls: ["./create-issue-page.component.css"],
})
export class CreateIssuePageComponent implements OnInit {
  createNewIssueForm: FormGroup;
  allStatus = ["Backlog", "In-Progress", "In-Test", "Done"];
  fileInputLabel: string;
  myimage: any;
  allUsersId: allUsersId;
  authToken: string;
  selectedReciever: allUsersId;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "20px",
    minHeight: "5rem",
    placeholder: "Enter text here...",
    translate: "no",
    defaultParagraphSeparator: "p",
    defaultFontName: "Arial",
    toolbarHiddenButtons: [["bold"]],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: "redText",
        class: "redText",
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ],
  };

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastrManager,
    private _sharedService: SharedService,
  ) {
    this.authToken = localStorage.getItem("authToken");
    this.getAllUsers();
  }

  ngOnInit(): void {
     // initialize issue create form
    this.createIssueForm();
  }

  // select one reciever name
  selectReciever = (data: allUsersId) => {
    this.selectedReciever = data;
  };

  onFileSelect(event) {
    this.myimage = event.target.files[0];
    this.fileInputLabel = this.myimage.name;
  }

  //issue create form
  createIssueForm(): void {
    this.createNewIssueForm = this._fb.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      status: ["", Validators.required],
    });
    this.createNewIssueForm.reset();
  }

  // request server to create a new user account
  onSubmit(formData1: any) {
    if (this.createNewIssueForm.valid && this.selectedReciever !== undefined) {
      let formData: any = new FormData();
      formData.append("creatorName", localStorage.getItem("name"));
      formData.append("creatorId", localStorage.getItem("userId"));
      formData.append("image", this.myimage);
      formData.append("recieverName", this.selectedReciever.name);
      formData.append("recieverId", this.selectedReciever.userId);
      formData.append("title", formData1.value.title);
      formData.append("status", formData1.value.status);
      formData.append("description", formData1.value.description);
      formData.append("authToken", this.authToken);

      this._sharedService
        .postImages(BaseURL.BASE_USER_ENDPOINT + "create/query", formData)
        .subscribe(
          (apiResponse) => {
            if (apiResponse.status === 200) {
              //console.log(apiResponse);
              this._toastr.successToastr(apiResponse.message, "Success");
            } else {
              this._toastr.errorToastr(apiResponse.message, "Error");
            }
          },
          (err) => {
            this._toastr.errorToastr(err.message, "Error");
          }
        );
      console.log(formData);
    } else {
      this._toastr.errorToastr("Enter all details !!", "Registration");
    }
  }

  // get all users
  getAllUsers = () => {
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "get/all/user", {
        authToken: this.authToken,
      })
      .subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            this.allUsersId = apiResponse.data;
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
