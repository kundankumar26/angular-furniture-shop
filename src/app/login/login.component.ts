import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: String[];
  constructor(private authService: AuthService, private router: Router, 
    private tokenStorage: TokenStorageService, private sharedServices: SharedService) { }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  onSubmit(): void {
    console.log(this.user);
    var payload: any = {
      username: this.user.empUsername,
      password: this.user.empPassword
    }
    this.authService.signin(payload).subscribe(data => {
      this.tokenStorage.saveToken(data.accessToken);
      this.tokenStorage.saveUser(data);

      this.isLoginFailed = false;
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      this.sharedServices.sendClickEvent();
      console.log(this.roles[0]);
      

      // console.log(this.roles);
      // setTimeout(() => 
      // {
      //     this.router.navigate(['/employee']);
      // },
      // 1000);
    }, err => {
      this.errorMessage = err.error.message;
      this.isLoginFailed = true;
    })
  }

}
