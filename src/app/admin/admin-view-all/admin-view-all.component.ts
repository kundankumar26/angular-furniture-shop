import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminResponse } from 'src/app/models/adminResponse';
import { Order } from 'src/app/models/order';
import { AuthService } from 'src/app/_services/auth.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-admin-view-all',
  templateUrl: './admin-view-all.component.html',
  styleUrls: ['./admin-view-all.component.css']
})
export class AdminViewAllComponent implements OnInit {

  orders: AdminResponse[];
  isAllowedToViewPage: number = 0;
  tokenExpired: boolean = false;
  errorOccured: boolean = false;
  
  constructor(private authService: AuthService, private router: Router, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    if(!window.sessionStorage.getItem('auth-token')){
      this.router.navigate(['login']);
    }
    this.authService.getOldOrdersForAdmin().subscribe(data => {
      console.log(data);
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
      this.errorOccured = true;
      console.log(err);
    });
  }

}
