import { SlicePipe } from '@angular/common';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../models/user';
import { AuthService } from '../_services/auth.service';
import { SharedService } from '../_services/shared.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User = new User();
  isLoginSuccess = false;
  isLoginFailed = false;
  signInForm: FormGroup;
  submitted: boolean = false;
  errorMessage = '';
  roles: String[];
  showEmployeeBoard: any;
  showVendorBoard: any;
  showAdminBoard: any;
  
  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService,
    private tokenStorage: TokenStorageService, private sharedServices: SharedService) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoginSuccess = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
    this.signInForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.isLoginFailed = false;
    if (this.signInForm.invalid) {
      return;
    }

    var payload: any = {
      username: this.signInForm.get('username').value,
      password: this.signInForm.get('password').value,
    }

    this.authService.signin(payload).subscribe(data => {
      this.tokenStorage.saveToken(data.accessToken);
      this.tokenStorage.saveUser(data);
      this.isLoginFailed = false;
      this.isLoginSuccess = true;
      this.roles = this.tokenStorage.getUser().roles;
      
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showVendorBoard = this.roles.includes('ROLE_VENDOR');
      this.showEmployeeBoard = this.roles.includes('ROLE_EMPLOYEE');

      this.toastr.success('Logged in as ' + this.roles[0].substr(5, this.roles[0].length), 'Hey ' + data.username, {closeButton: true});
      
      this.router.navigate(['home']);
      this.sharedServices.sendClickEvent();
    }, err => {
      this.errorMessage = err.error.message;
      this.isLoginFailed = true;
      console.log(err);
    });
    this.isLoginFailed = false;
  }

}
