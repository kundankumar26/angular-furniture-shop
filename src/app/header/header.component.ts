import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedService } from '../_services/shared.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  private roles: string[];
  isLoggedIn: boolean = false;
  showAdminBoard: boolean = false;
  showVendorBoard: boolean = false;
  showEmployeeBoard: boolean = false;
  username: string;
  clickEventsubscription: Subscription;

  constructor(private tokenStorageService: TokenStorageService, private sharedService: SharedService, 
      private router: Router) { 
    this.clickEventsubscription = this.sharedService.getClickEvent().subscribe(()=>{
      window.location.reload();
      console.log("inside header");
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showVendorBoard = this.roles.includes('ROLE_VENDOR');
      this.showEmployeeBoard = this.roles.includes('ROLE_EMPLOYEE');

      this.username = user.username;
      console.log(user.roles);

      if(this.showEmployeeBoard){
        this.router.navigate(['employee']);
      } else if(this.showVendorBoard){
        this.router.navigate(['vendor']);
      } else if(this.showAdminBoard){
        this.router.navigate(['admin']);
      }
    }
  }

  logout(): void {
    this.tokenStorageService.signOut();
  }

}
