import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrManager } from "ng6-toastr-notifications";
import { SharedService } from "src/app/shared/shared.service";
import { BaseURL } from "src/app/shared/base-url";
import { Router } from "@angular/router";
import { LoginService } from "../login.service";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"],
})
export class LoginPageComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastrManager,
    private _sharedService: SharedService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm(): void {
    this.loginForm = this._fb.group({
      email: ["", Validators.compose([Validators.required, Validators.email])],
      password: ["", Validators.required],
    });
    this.loginForm.reset();
  }

  // send reques for loging
  onSubmit(formData: any) {
    if (this.loginForm.valid) {
      this._sharedService
        .post(BaseURL.BASE_USER_ENDPOINT + "login", formData.value)
        .subscribe(
          (apiResponse) => {
            if (apiResponse.status === 200) {
              console.log(apiResponse);
              localStorage.setItem("authToken", apiResponse.data.authToken);
              localStorage.setItem(
                "userId",
                apiResponse.data.userDetails.userId
              );
              localStorage.setItem("name", apiResponse.data.userDetails.name);
              this._router.navigate(["/dashboard"]);
            } else {
              this._toastr.errorToastr(apiResponse.message, "Error");
            }
          },
          (err) => {
            this._toastr.errorToastr(err.message, "Error");
          }
        );

    } else {
      this._toastr.errorToastr("Error Occured !!", "Login!");
    }
  }
}
