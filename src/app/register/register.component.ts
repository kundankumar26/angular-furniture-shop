import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../_services/alert.service';
import { AuthService } from '../_services/auth.service';
import { SignupRequestPayload } from './register-request.payload';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  signupRequestPayload: SignupRequestPayload;
  signupForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  isSignUpFailed: boolean = false;
  errorMessage: string;
  isSignUpSuccess: boolean = false;
  errorMessageDisplay: boolean;
  verificationEmail: string;

  constructor(private authService: AuthService, private router: Router, private alertService: AlertService) { }

  ngOnInit(): void {
    console.log("hey there");
    this.signupForm = new FormGroup({
      empId: new FormControl('', [Validators.required, Validators.maxLength(6), Validators.pattern("^[0-9].....$")]),
      empFirstName: new FormControl('', [Validators.required, Validators.minLength(1)]),
      empLastName: new FormControl('', [Validators.required, Validators.minLength(1)]),
      empUsername: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      empPassword: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      role: new FormControl('', Validators.required)
    });
  }

  addStyleToErrorMessage(){
    return {
      'alert-danger': this.isSignUpFailed,
      'alert-success': this.isSignUpSuccess,
    }
  }

  signup(): void {
    this.submitted = true;
    if (this.signupForm.invalid) {
      return;
    }
    this.verificationEmail = this.signupForm.get('email').value;
    this.signupRequestPayload = {
      empId: this.signupForm.get('empId').value,
      empFirstName: this.signupForm.get('empFirstName').value,
      empLastName: this.signupForm.get('empLastName').value,
      empUsername: this.signupForm.get('empUsername').value,
      email: this.signupForm.get('email').value,
      empPassword: this.signupForm.get('empPassword').value,
      role: this.signupForm.get('role').value,
    };

    this.loading = true;
    this.errorMessageDisplay = true;
    
    this.authService.signup(this.signupRequestPayload)
      .subscribe(data => {
        this.errorMessage = "We've sent an email to " + this.verificationEmail + " with instructions. Please click the link in the mail to activate your account.";
        this.isSignUpFailed = false;
        this.isSignUpSuccess = true;
        this.loading = false;
        //this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      }, err => {
        this.errorMessage = err.error.message;
        this.isSignUpSuccess = false;
        this.isSignUpFailed = true;
        this.loading = false;
        console.log(this.errorMessage, err);
      });
    
  }

}
