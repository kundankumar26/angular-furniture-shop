import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../../models/order';
import { AuthService } from '../../_services/auth.service';
import { TokenStorageService } from '../../_services/token-storage.service';
import { AgGridModule } from 'ag-grid-angular';
import { map } from 'jquery';
import { AdminResponse } from 'src/app/models/adminResponse';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {

  orders: AdminResponse[];
  ordersMap = new Map();
  tokenExpired: boolean = false;
  errorType: number = 0;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private tokenStorage: TokenStorageService,
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    if(!this.tokenStorage.getToken()){
      this.router.navigate(['login']);
    }
    this.ngxLoader.start();

    this.authService.getOrdersForAdmin().subscribe(data => {
      data['body'].forEach((element: any, index: any) => {
        this.ordersMap.set(data['body'][index].orderId, index);
      });
      console.log(data.body);
      this.ngxLoader.stop();
      this.orders = data.body;
    }, err => {
      //Token expired
      if(err.error.status == 401){
        this.tokenExpired = true;
        this.errorType = 404;
        this.tokenStorage.signOut();
      }
      //Access not Authorised
      if(err.error.status == 403){
        this.errorType = 403;
        return;
      }
      this.ngxLoader.stop();
      this.showToastMessage(2, err.error.message);
      console.log(err);
    });
  }

  ifAcceptedByAdmin(isRejectedByAdmin: number): string{
    return isRejectedByAdmin == 1 ? "Approved" : "Rejected";
  }

  acceptOrder(orderId: number, qty: number, productId: number){
    this.authService.acceptOrderByAdmin(orderId, qty, productId).subscribe(data => {
      const ordersTable = this.orders[this.ordersMap.get(orderId)];
      ordersTable.isRejectedByAdmin = 1;
      ordersTable.productQty = ordersTable.productQty - qty
      this.showToastMessage(1, "1 order accepted");
    }, err => {
      this.showToastMessage(2, err.error.message);
      console.log(err);
    });
  }

  rejectOrder(orderId: number){
    this.authService.rejectOrderByAdmin(orderId).subscribe(data => {
      this.orders[this.ordersMap.get(orderId)].isRejectedByAdmin = 2;
      this.showToastMessage(3, "1 order rejected");
    }, err => {
      this.showToastMessage(2, err.error.message);
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
