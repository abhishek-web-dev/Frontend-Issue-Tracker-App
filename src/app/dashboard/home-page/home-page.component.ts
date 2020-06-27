import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { ViewIssuePageComponent } from "../view-issue-page/view-issue-page.component";
import { SharedService } from "src/app/shared/shared.service";
import { BaseURL } from "src/app/shared/base-url";
import { ToastrManager } from "ng6-toastr-notifications";
import { NgxSpinnerService } from 'ngx-spinner';

export interface queryElement {
  title: string;
  creatorName: string;
  status: string;
  createdOn: Date;
  select: string;
}

@Component({
  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrls: ["./home-page.component.css"],
})
export class HomePageComponent implements OnInit {
  queryCreatedByYou: boolean = false;
  queryAssignToYou: boolean = false;
  queryAll: boolean = true;
  inBacklog: number;
  inProgress: number;
  inTest: number;
  inDone: number;
  authToken: object;
  allQuery: queryElement[] = [];
  allQueryCreatedByYou: queryElement[] = [];
  allQueryAssignToYou: queryElement[] = [];
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
    this.userId = localStorage.getItem("userId");
    this.authToken = { authToken: localStorage.getItem("authToken") };
    this.getAllQuery();
  }

  ngOnInit() {}

  // filter table data
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // this pass query id to view component
  openDialog(value: any) {
    this.dialog.open(ViewIssuePageComponent, {
      data: {
        queryId: value,
      },
    });
  }

  // get all query
  getAllQuery = () => {
    this.spinner.show();
    this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "get/all/query", this.authToken)
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

              if (this.userId == item.creatorId) {
                this.allQueryCreatedByYou.push(obj);
              }
              if (this.userId == item.recieverId) {
                this.allQueryAssignToYou.push(obj);
              }
              return obj;
            });
            this.dataSource = new MatTableDataSource<queryElement>(
              this.allQuery
            );
            this.spinner.hide();
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

  //all checked box filter method
  onCheckbox1(e) {
    this.queryAssignToYou = e.checked;
    this.filterMethod();
  }
  onCheckbox2(e) {
    this.queryCreatedByYou = e.checked;
    this.filterMethod();
  }
  onCheckbox3(e) {
    this.queryAll = e.checked;
    this.filterMethod();
  }

  filterMethod = () => {
    // if all three check box unchecked
    if (!this.queryAll && !this.queryAssignToYou && !this.queryCreatedByYou) {
      this.statusInitialValue();
      this.dataSource = new MatTableDataSource<queryElement>([]);
      return;
    }

    // if all query check box checked
    if (this.queryAll) {
      this.statusInitialValue();
      this.allQuery.map((item) => {
        this.statusIncrement(item);
      });
      this.dataSource = new MatTableDataSource<queryElement>(this.allQuery);
      return;
    }

    // if query assign to you check box checked
    if (this.queryAssignToYou && !this.queryCreatedByYou) {
      this.statusInitialValue();
      this.allQueryAssignToYou.map((item) => {
        this.statusIncrement(item);
      });
      this.dataSource = new MatTableDataSource<queryElement>(
        this.allQueryAssignToYou
      );
      return;
    }

    // if query assign By you check box checked
    if (this.queryCreatedByYou && !this.queryAssignToYou) {
      this.statusInitialValue();
      this.allQueryCreatedByYou.map((item) => {
        this.statusIncrement(item);
      });
      this.dataSource = new MatTableDataSource<queryElement>(
        this.allQueryCreatedByYou
      );
      return;
    }

    // if query assignByYou and assignToYou check box checked
    if (this.queryCreatedByYou && this.queryAssignToYou) {
      this.statusInitialValue();
      let arr: queryElement[] = [
        ...this.allQueryAssignToYou,
        ...this.allQueryCreatedByYou,
      ];
      arr.map((item) => {
        this.statusIncrement(item);
      });
      this.dataSource = new MatTableDataSource<queryElement>(arr);
    }
    return;
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
