import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../_services/auth.service';
import { SharedService } from '../_services/shared.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  signupForm: FormGroup;
  signinForm: FormGroup;
  loading: boolean = false;
  showPasswordBool: boolean = false;
  showPasswordBool2: boolean = false;
  showSignupError: string = null;
  showSignInError: string = null;
  getBoardType: boolean = false;
  verificationEmail: string = null;

  constructor(private authService: AuthService, private router: Router, private tokenStorage: TokenStorageService, 
    private toastr: ToastrService, private sharedServices: SharedService) { }

  ngOnInit(): void {

    this.signupForm = new FormGroup({
      empId: new FormControl(null, [Validators.required, Validators.maxLength(6), Validators.pattern("^[0-9].....$")]),
      empFirstName: new FormControl(null, [Validators.required, Validators.minLength(1)]),
      empLastName: new FormControl(null, [Validators.required, Validators.minLength(1)]),
      empUsername: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      empPassword: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      role: new FormControl(null, Validators.required)
    });

    this.signinForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  get form() {
    return this.signupForm.controls;
  }

  signup(value: any) {
    console.log(value);
    if(this.showSignupErrorType()){
      return;
    }
    console.log(" verified in signup");
    this.loading = true;
    this.verificationEmail = this.signupForm.get('email').value;
    const signupRequestPayload = {
      empId: this.signupForm.get('empId').value,
      empFirstName: this.signupForm.get('empFirstName').value,
      empLastName: this.signupForm.get('empLastName').value,
      empUsername: this.signupForm.get('empUsername').value,
      email: this.signupForm.get('email').value,
      empPassword: this.signupForm.get('empPassword').value,
      role: this.signupForm.get('role').value,
    };
    
    this.authService.signup(signupRequestPayload)
      .subscribe(data => {
        this.loading = false;
        this.toastr.success('Account created successfully.', null, {closeButton: true});
        this.toggleBoard();
        this.signupForm.reset();
        //this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
      }, err => {
        this.verificationEmail = null;
        this.loading = false;
        if(err.status == 406){
          this.showSignupError = err.error.message;
          return;
        }
        this.toastr.error('Failed to create new account', null, {closeButton: true});
        console.log(err);
      });
  }

  showPassword() {
    this.showPasswordBool = !this.showPasswordBool;
  }

  showSignupErrorType(): boolean {
    if(this.signupForm.get('role').invalid){
      this.showSignupError = "Role is required.";
      return true;
    } else if(this.signupForm.get('empId').invalid){
      this.showSignupError = "Your emp ID must be 6 digits only.";
      return true;
    } else if(this.signupForm.get('empFirstName').invalid){
      this.showSignupError = "Your first name must be 1-20 characters.";
      return true;
    } else if(this.signupForm.get('empLastName').invalid){
      this.showSignupError = "Your last name must be 1-20 characters.";
      return true;
    } else if(this.signupForm.get('empUsername').invalid){
      this.showSignupError = "Your username must be 6-20 characters.";
      return true;
    } else if(this.signupForm.get('email').invalid){
      this.showSignupError = "Please enter valid email";
      return true;
    } else if(this.signupForm.get('empPassword').invalid){
      this.showSignupError = "Your password must be 6-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.";
      return true;
    }
    this.showSignupError = null;
    return false;
  }

  signIn(value: any){
    this.verificationEmail = null;
    if(this.showSignInErrorType()){
      return;
    }
    console.log(" verified sign in ");

    const payload: any = {
      username: this.signinForm.get('username').value,
      password: this.signinForm.get('password').value,
    }

    this.authService.signin(payload).subscribe(data => {
      this.tokenStorage.saveToken(data.accessToken);
      this.tokenStorage.saveUser(data);
      const roles = this.tokenStorage.getUser().roles;
      const username = data.username?.substr(0, 1).toUpperCase() + data.username?.substr(1, data.username.length);
      this.toastr.success('Logged in as ' + roles[0].substr(5, roles[0].length), 'Hey ' + username, {closeButton: true});
      this.router.navigate(['home']);
      this.sharedServices.sendClickEvent();
    }, err => {
      if(err.status >= 400 && err.status < 500){
        this.showSignInError = err.error.message;
        return;
      }
      this.toastr.error('Failed to log in', null, {closeButton: true});
      console.log(err);
    });
  }

  showPassword2() {
    this.showPasswordBool2 = !this.showPasswordBool2;
  }

  showSignInErrorType(): boolean {
    if(this.signinForm.get('username').invalid){
      this.showSignInError = "Your username must be 6-20 characters.";
      return true;
    } else if(this.signinForm.get('password').invalid){
      this.showSignInError = "Your password must be 6-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.";
      return true;
    }
    this.showSignInError = null;
    return false;
  }

  toggleBoard() {
    this.getBoardType = !this.getBoardType;
  }

}
