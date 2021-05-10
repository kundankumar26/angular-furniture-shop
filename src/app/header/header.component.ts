import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedService } from '../_services/shared.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { HeaderComponentService } from './header-component.service';

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
  filterText: string;

  constructor(
    private tokenStorageService: TokenStorageService, 
    private sharedService: SharedService, 
    private router: Router, 
    private headerService: HeaderComponentService
  ) { 
    this.clickEventsubscription = this.sharedService.getClickEvent().subscribe(()=>{
      this.checkIfUserLoggedIn();
    });
  }

  ngOnInit(): void {
    this.checkIfUserLoggedIn();
  }

  sendTextToComponent(value: string){
    this.filterText = value;
    this.headerService.setSearchText(this.filterText);
  }

  checkIfUserLoggedIn(){
    this.isLoggedIn = !!this.tokenStorageService.getToken();
      if(this.isLoggedIn){
        const user = this.tokenStorageService.getUser();
        this.roles = user.roles;
        this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
        this.showVendorBoard = this.roles.includes('ROLE_VENDOR');
        this.showEmployeeBoard = this.roles.includes('ROLE_EMPLOYEE');
        this.username = user.username;
        console.log(this.username);
      }
  }

  logout(): void {
    this.tokenStorageService.signOut();
    this.isLoggedIn = false;
    this.router.navigate(['login']);
  }

}
