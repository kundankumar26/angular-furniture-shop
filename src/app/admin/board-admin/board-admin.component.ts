import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../../models/order';
import { AuthService } from '../../_services/auth.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { AgGridModule } from 'ag-grid-angular';
import { map } from 'jquery';
import { AdminResponse } from 'src/app/models/adminResponse';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {

  orders: AdminResponse[];
  ordersMap = new Map();
  isAllowedToViewPage: number = 0;
  tokenExpired: boolean = false;
  errorOccured: boolean = false;

  constructor(private authService: AuthService, private router: Router, private tokenStorage: TokenStorageService) { }

  ngOnInit(): void {
    if(!window.sessionStorage.getItem('auth-token')){
      this.router.navigate(['login']);
    }
    this.authService.getOrdersForAdmin().subscribe(data => {
      data['body'].forEach((element: any, index: any) => {
        this.ordersMap.set(data['body'][index].orderId, index);
      });
      console.log(data.body);
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

  ifAcceptedByAdmin(isRejectedByAdmin: number): string{
    return isRejectedByAdmin == 1 ? "Approved" : "Rejected";
  }

  acceptOrder(orderId: number, qty: number){
    this.authService.acceptOrderByAdmin(orderId, qty).subscribe(data => {
      const order = data['body'];
      this.orders[this.ordersMap.get(order.orderId)].isRejectedByAdmin = order.isRejectedByAdmin; 
    }, err => {
      this.errorOccured = true;
      console.log(err);
    });
  }

  rejectOrder(orderId: number, qty: number){
    this.authService.rejectOrderByAdmin(orderId, qty).subscribe(data => {
      const order = data['body'];
      this.orders[this.ordersMap.get(order.orderId)].isRejectedByAdmin = order.isRejectedByAdmin; 
    }, err => {
      this.errorOccured = true;
      console.log(err);
    });
  }

  isDisabled(value: number): boolean {
    return value == 0 ? false : true;
  }
}
