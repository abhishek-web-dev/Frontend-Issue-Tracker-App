import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Resolve,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { SharedService } from "../shared/shared.service";
import { BaseURL } from "../shared/base-url";
import { map, filter, mergeMap, take } from "rxjs/operators";
import "rxjs/add/operator/map";
import Swal from "sweetalert2";


@Injectable({
  providedIn: "root",
})
export class ResolveGuard implements Resolve<any> {
  constructor(private _sharedService: SharedService, private router: Router) {}

  resolve(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    let queryId = next.paramMap.get("queryId");
    return this._sharedService
      .post(BaseURL.BASE_USER_ENDPOINT + "get/one/query", {
        authToken: localStorage.getItem("authToken"),
        queryId: queryId,
      })
      .map((apiResponse) => {
        if (apiResponse.status == 200) {
          return apiResponse;
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: `${apiResponse.message}`,
          });
          this.router.navigate(["/dashboard"]);
          return null;
        }
      });
  }
}
