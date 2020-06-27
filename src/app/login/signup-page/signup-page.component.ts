import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrManager } from "ng6-toastr-notifications";
import { SharedService } from "src/app/shared/shared.service";
import { BaseURL } from "src/app/shared/base-url";
import { Router } from '@angular/router';

@Component({
  selector: "app-signup-page",
  templateUrl: "./signup-page.component.html",
  styleUrls: ["./signup-page.component.css"],
})
export class SignupPageComponent implements OnInit {
  signupForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _toastr: ToastrManager,
    private _sharedService: SharedService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.createSignupForm();
  }

  createSignupForm(): void {
    this.signupForm = this._fb.group({
      name: ["", Validators.required],
      email: ["", Validators.compose([Validators.required, Validators.email])],
      password: ["", Validators.required],
      mobileNumber: ["", Validators.required],
    });
    this.signupForm.reset();
  }

  // request server to create a new user account
  onSubmit(formData: any) {
    if (this.signupForm.valid) {
      this._sharedService
        .post(BaseURL.BASE_USER_ENDPOINT + "signup", formData.value)
        .subscribe(
          (apiResponse) => {
            if (apiResponse.status === 200) {
              this._toastr.successToastr(apiResponse.message, "Success");
              this._router.navigate(["/login"]);
            } else {
              this._toastr.errorToastr(apiResponse.message, "Error");
            }
          },
          (err) => {
            this._toastr.errorToastr(err.message, "Error");
          }
        );
    } else {
      this._toastr.errorToastr("Error Occured !!", "Registration");
    }
  }
}
