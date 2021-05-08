import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../../models/order';
import { AuthService } from '../../_services/auth.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { AgGridModule } from 'ag-grid-angular';
import { map } from 'jquery';
import { AdminResponse } from 'src/app/models/adminResponse';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private authService: AuthService, private router: Router, private tokenStorage: TokenStorageService,
     private toastr: ToastrService) { }

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
      this.showToastMessage(2, err.error.message);
      this.errorOccured = true;
      console.log(err);
    });
  }

  ifAcceptedByAdmin(isRejectedByAdmin: number): string{
    return isRejectedByAdmin == 1 ? "Approved" : "Rejected";
  }

  acceptOrder(orderId: number, qty: number, productId: number){
    this.authService.acceptOrderByAdmin(orderId, qty, productId).subscribe(data => {
      const order = data['body'];
      const ordersTable = this.orders[this.ordersMap.get(order.orderId)];
      ordersTable.isRejectedByAdmin = order.isRejectedByAdmin;
      ordersTable.productQty = ordersTable.productQty - qty
      this.showToastMessage(1, "1 order accepted");
    }, err => {
      this.errorOccured = true;
      this.showToastMessage(2, err.error.message);
      console.log(err);
    });
  }

  rejectOrder(orderId: number){
    this.authService.rejectOrderByAdmin(orderId).subscribe(data => {
      const order = data['body'];
      this.orders[this.ordersMap.get(order.orderId)].isRejectedByAdmin = order.isRejectedByAdmin;
      this.showToastMessage(3, "1 order rejected");
    }, err => {
      this.showToastMessage(2, err.error.message);
      this.errorOccured = true;
      console.log(err);
    });
  }

  showToastMessage(decision: number, message: string){
    if(decision == 1){
      this.toastr.success(message, null, {closeButton: true});
    }
    if(decision == 2){
      this.toastr.error(message, null, {closeButton: true});
    }
    if(decision == 3){
      this.toastr.warning(message, null, {closeButton: true});
    }
  }

  showProductQty(qty: number){
    if(qty > 5){
      return qty + " left";
    } else if(qty == 0){
      return "0 left";
    } else{
      return `only ${qty} left`;
    }
  }

  isDisabled(value: number): boolean {
    return value == 0 ? false : true;
  }
}
