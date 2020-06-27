import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { ViewIssuePageComponent } from "../view-issue-page/view-issue-page.component";
import { SharedService } from "src/app/shared/shared.service";
import { BaseURL } from "src/app/shared/base-url";
import { ToastrManager } from "ng6-toastr-notifications";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";

export interface queryElement {
  title: string;
  creatorName: string;
  status: string;
  createdOn: Date;
  select: string;
}

@Component({
  selector: "app-watchlist-page",
  templateUrl: "./watchlist-page.component.html",
  styleUrls: ["./watchlist-page.component.css"],
})
export class WatchlistPageComponent implements OnInit {
  inBacklog: number;
  inProgress: number;
  inTest: number;
  inDone: number;
  authToken: string;
  allQuery: queryElement[] = [];
  userId: string;
  displayedColumns: string[] = [
    "title",
    "creatorName",
    "status",
    "createdOn",
    "select",
  ];
  dataSource = new MatTableDataSource<queryElement>(this.allQuery);

  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    this.dataSource.paginator = value;
  }

  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    this.dataSource.sort = value;
  }

  constructor(
    public dialog: MatDialog,
    private _sharedService: SharedService,
    private _toastr: ToastrManager,
    private spinner: NgxSpinnerService
  ) {
    this.statusInitialValue();
    this.userId = localStorage.getItem("userId");
    this.authToken = localStorage.getItem("authToken");
    this.getAllWatchlistQuery();
  }

  ngOnInit() {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(value: any) {
    this.dialog.open(ViewIssuePageComponent, {
      data: {
        queryId: value,
      },
    });
  }

  // get all watchlist query
  getAllWatchlistQuery = () => {
    this.spinner.show();
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "get/all/watchlist/query", {
        authToken: this.authToken,
        userId: this.userId,
      })
      .subscribe(
        (apiResponse) => {
          if (apiResponse.status === 200) {
            this.statusInitialValue();
            this.allQuery = apiResponse.data.map((item) => {
              //"Backlog", "In-Progress", "In-Test", "Done"
              let obj: queryElement = {
                title: item.title,
                creatorName: item.creatorName,
                status: item.status,
                createdOn: item.createdOn,
                select: item.queryId,
              };
              this.statusIncrement(obj);
              return obj;
            });
            this.dataSource = new MatTableDataSource<queryElement>(
              this.allQuery
            );
            this.spinner.hide();
          } else {
            this.allQuery = [] ;
            this.spinner.hide();
            this._toastr.errorToastr(apiResponse.message, "Error");
          }
        },
        (err) => {
          this._toastr.errorToastr(err.message, "Error");
        }
      );
  };

  // delete one watchlist query
  deleteWatchlistQuery = (queryId: string) => {
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
          .post(BaseURL.BASE_USER_ENDPOINT + "delete/query/from/watchlist", {
            authToken: this.authToken,
            userId: this.userId,
            queryId:queryId
          })
          .subscribe(
            (apiResponse) => {
              if (apiResponse.status === 200) {
                this.getAllWatchlistQuery();
                Swal.fire(
                  "Deleted!",
                  "You have unsubscribed the Query.",
                  "success"
                ); 
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

  // status increment method
  statusIncrement = (item: queryElement) => {
    if (item.status == "Backlog") {
      this.inBacklog++;
    }
    if (item.status == "In-Progress") {
      this.inProgress++;
    }
    if (item.status == "In-Test") {
      this.inTest++;
    }
    if (item.status == "Done") {
      this.inDone++;
    }
  };

  //initialise status value
  statusInitialValue = () => {
    this.inBacklog = 0;
    this.inProgress = 0;
    this.inTest = 0;
    this.inDone = 0;
  };
}
