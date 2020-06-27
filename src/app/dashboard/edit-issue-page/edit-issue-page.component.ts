import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrManager } from "ng6-toastr-notifications";
import { Router, ActivatedRoute } from "@angular/router";
import { SharedService } from "src/app/shared/shared.service";
import { BaseURL } from "src/app/shared/base-url";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { MatDialog } from "@angular/material/dialog";
import { ViewIssuePageComponent } from "../view-issue-page/view-issue-page.component";
import { Location } from "@angular/common";
import Swal from "sweetalert2";

export interface oneQueryData {
  title: string;
  status: string;
  recieverName: string;
  recieverId: string;
  description: string;
}

export interface allUsersId {
  userId: string;
  name: string;
}

@Component({
  selector: "app-edit-issue-page",
  templateUrl: "./edit-issue-page.component.html",
  styleUrls: ["./edit-issue-page.component.css"],
})
export class EditIssuePageComponent implements OnInit {
  updateNewIssueForm: FormGroup;
  commentForm: FormGroup;
  allStatus = ["Backlog", "In-Progress", "In-Test", "Done"];
  allUsersId: allUsersId;
  queryId: string;
  oneQueryData: oneQueryData;
  fileInputLabel: string;
  myimage: any;
  authtoken: string;
  selectedReciever: allUsersId;
  editButton: string;
  deleteButton: boolean = true;
  editButtonDisabled: boolean = true;
  userId: string;
  pageNo: number = 0;
  allMessageData: any = [];

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
    private _router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private _location: Location
  ) {
    this.authtoken = localStorage.getItem("authToken");
    this.userId = localStorage.getItem("userId");
    // get resolved data from router
    this.route.data.subscribe((params) => {
      this.queryId = params.queryData.data[0].queryId;
      if (this.userId == params.queryData.data[0].creatorId) {
        this.deleteButton = false;
      }
      if (
        this.userId == params.queryData.data[0].recieverId ||
        this.userId == params.queryData.data[0].creatorId
      ) {
        this.editButtonDisabled = false;
      }
      this.oneQueryData = params.queryData.data[0];
      this.selectedReciever = {
        name: this.oneQueryData.recieverName,
        userId: this.oneQueryData.recieverId,
      };

    });

    // get all users name
    this.getAllUsers();
    // get ten message
    this.getTenMessages();
  }

  ngOnInit(): void {
    this.createIssueForm();
    this.createCommentForm();
    // initialize edit form value
    this.updateNewIssueForm.patchValue({
      title: this.oneQueryData.title,
      status: this.oneQueryData.status,
      description: this.oneQueryData.description,
    });
  }

  // select one reciever name
  selectReciever = (data: allUsersId) => {
    this.selectedReciever = data;
  };

  // only edit button work
  changeEditButton() {
    this.editButton = "editButton";
  }

  // go to previous page
  goBack() {
    this._location.back();
  }

  // initialize comment form
  createCommentForm(): void {
    this.commentForm = this._fb.group({
      message: ["", Validators.required],
    });
    this.commentForm.reset();
  }

  // get one query data
  getOneQueryData = () => {
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "get/one/query", {
        authToken: this.authtoken,
        queryId: this.queryId,
      })
      .subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            if (this.userId == apiResponse.data[0].creatorId) {
              this.deleteButton = false;
            }
            if (
              this.userId == apiResponse.data[0].recieverId ||
              this.userId == apiResponse.data[0].creatorId
            ) {
              this.editButtonDisabled = false;
            }
            this.oneQueryData = apiResponse.data[0];
            this.selectedReciever = {
              name: this.oneQueryData.recieverName,
              userId: this.oneQueryData.recieverId,
            };
            this.updateNewIssueForm.patchValue({
              title: this.oneQueryData.title,
              status: this.oneQueryData.status,
              description: this.oneQueryData.description,
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

  // create a new comment
  onComment(formData: any) {
    let model = {
      authToken: this.authtoken,
      message: formData.value.message,
      queryId: this.queryId,
      senderName: localStorage.getItem("name"),
      senderId: this.userId,
    };
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "create/message", model)
      .subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            this.pageNo = 0;
            this.getTenMessages();
          } else {
            this._toastr.errorToastr(apiResponse.message, "Error");
          }
        },
        (err) => {
          this._toastr.errorToastr(err.message, "Error");
        }
      );
    console.log(formData.value);
    this.commentForm.reset();
  }

  openDialog() {
    this.dialog.open(ViewIssuePageComponent, {
      data: {
        queryId: this.queryId,
      },
    });
  }

  onFileSelect(event) {
    this.myimage = event.target.files[0];
    this.fileInputLabel = this.myimage.name;
  }

  createIssueForm(): void {
    this.updateNewIssueForm = this._fb.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      status: ["", Validators.required],
    });
    this.updateNewIssueForm.reset();
  }

  // request server to edit query
  onSubmit(formData1: any) {
    if (
      this.updateNewIssueForm.valid &&
      this.selectedReciever !== undefined &&
      this.editButton == "editButton"
    ) {
      let formData: any = new FormData();
      if (this.myimage) {
        formData.append("image", this.myimage);
      }
      formData.append("queryId", this.queryId);
      formData.append("recieverName", this.selectedReciever.name);
      formData.append("recieverId", this.selectedReciever.userId);
      formData.append("title", formData1.value.title);
      formData.append("status", formData1.value.status);
      formData.append("description", formData1.value.description);
      formData.append("authToken", this.authtoken);
      formData.append("userId", this.userId);
      formData.append("userName", localStorage.getItem("name"));

      this._sharedService
        .postImages(BaseURL.BASE_USER_ENDPOINT + "edit/query", formData)
        .subscribe(
          (apiResponse) => {
            if (apiResponse.status === 200) {
              this._toastr.successToastr(apiResponse.message, "Success");
              this.getOneQueryData();
              this.editButton = '';
            } else {
              this._toastr.errorToastr(apiResponse.message, "Error");
            }
          },
          (err) => {
            this._toastr.errorToastr(err.message, "Error");
          }
        );
      console.log(formData);
    }
  }

  // get all users
  getAllUsers = () => {
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "get/all/user", {
        authToken: this.authtoken,
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

  // get ten messages
  getTenMessages = () => {
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "get/ten/message", {
        authToken: this.authtoken,
        queryId: this.queryId,
        skip: this.pageNo * 10,
      })
      .subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            if (this.pageNo == 0) {
              this.allMessageData = [];
            }
            const newPost = apiResponse.data;
            // add newly fetched posts to the existing post
            this.allMessageData = this.allMessageData.concat(newPost);
          } else {
            this._toastr.errorToastr(apiResponse.message, "Error");
          }
        },
        (err) => {
          this._toastr.errorToastr(err.message, "Error");
        }
      );
  };

  // add user to query watchlist
  addToWatchlist = () => {
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "add/to/watchlist/query", {
        authToken: this.authtoken,
        queryId: this.queryId,
        userId: this.userId,
      })
      .subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            this._toastr.successToastr(apiResponse.message, "Success");
          } else {
            this._toastr.errorToastr(apiResponse.message, "Error");
          }
        },
        (err) => {
          this._toastr.errorToastr(err.message, "Error");
        }
      );
  };

  // get 10 message on click
  getMoreData = () => {
    this.pageNo++;
    this.getTenMessages();
  };

  // delete query
  deleteQuery = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this Query!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this._sharedService
          .post(BaseURL.BASE_USER_ENDPOINT + "delete/query", {
            authToken: this.authtoken,
            queryId: this.queryId,
            userId: this.userId,
          })
          .subscribe(
            (apiResponse) => {
              if (apiResponse.status === 200) {
                Swal.fire(
                  "Deleted!",
                  "Your Query has been deleted.",
                  "success"
                );
                this._router.navigate(["/dashboard"]);
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Something went wrong!",
                });
              }
            },
            (err) => {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Something went wrong!",
              });
            }
          );
      }
    });
  };
}
