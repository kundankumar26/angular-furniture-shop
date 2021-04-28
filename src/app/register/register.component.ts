import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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

  constructor(private authService: AuthService, private router: Router, private alertService: AlertService) {
    
  }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      empId: new FormControl('', [Validators.required, Validators.minLength(6)]),
      empFirstName: new FormControl('', [Validators.required, Validators.minLength(1)]),
      empLastName: new FormControl('', [Validators.required, Validators.minLength(1)]),
      empUsername: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      empPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      role: new FormControl('', Validators.required)
    });
    this.isSignUpFailed = false;
  }

  signup(): void {
    this.submitted = true;
    if (this.signupForm.invalid) {
      return;
    }
    this.alertService.clear();
    this.signupRequestPayload = {
      empId: this.signupForm.get('empId').value,
      empFirstName: this.signupForm.get('empFirstName').value,
      empLastName: this.signupForm.get('empLastName').value,
      empUsername: this.signupForm.get('empUsername').value,
      email: this.signupForm.get('email').value,
      empPassword: this.signupForm.get('empPassword').value,
      role: this.signupForm.get('role').value,
    };
    
    // this.signupRequestPayload.empId = this.signupForm.get('empId').value;
    // this.signupRequestPayload.empFirstName = this.signupForm.get('empFirstName').value;
    // this.signupRequestPayload.empLastName = this.signupForm.get('empLastName').value;
    // this.signupRequestPayload.empUsername = this.signupForm.get('empUsername').value;
    // this.signupRequestPayload.email = this.signupForm.get('email').value;
    // this.signupRequestPayload.empPassword = this.signupForm.get('empPassword').value;
    // this.signupRequestPayload.role = this.signupForm.get('role').value;

    this.loading = true;
    this.alertService.success('Account created successfully');
    
    this.authService.signup(this.signupRequestPayload)
      .subscribe(data => {
        this.alertService.success('Account created successfully', { keepAfterRouteChange: true });
        this.submitted = false;
        this.loading = false;
        this.isSignUpSuccess = true;
        //this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      }, err => {
        this.submitted = false;
        this.loading = false;
        this.isSignUpFailed = true;
        this.errorMessage = err.error.message;
        console.log(this.errorMessage, err);
      });
    console.log(this.signupRequestPayload);
    this.isSignUpFailed = false;
  }

}
