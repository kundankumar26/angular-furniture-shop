import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../models/order';
import { AuthService } from '../_services/auth.service';
import { SharedService } from '../_services/shared.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  orders: Order[];
  clickEventsubscription: any;
  isAllowedToViewPage: number = 0;
  tokenExpired: boolean = false;
  
  constructor(private authService: AuthService, private router: Router, private sharedService: SharedService,
    private tokenStorage: TokenStorageService) { 
    this.clickEventsubscription = this.sharedService.getClickEvent().subscribe(()=>{
      window.location.reload();
      console.log("inside header");
    });
  }

  ngOnInit(): void {
    if(!window.sessionStorage.getItem('auth-token')){
      this.router.navigate(['login']);
    }
    this.authService.getOrdersForEmployee().subscribe(data => {
      this.orders = data.body;
    }, err => {
      //Authentication Failed
      if(err.error.status == 401){
        this.tokenExpired = true;
        this.tokenStorage.signOut();
      }
      //Access not Authorised
      if(err.error.status == 403){
        this.isAllowedToViewPage = 1;
        return;
      }
      console.log(err);
    });
  }

}
