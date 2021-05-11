import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LoadingScreenService } from 'src/app/_services/loading-screen.service';
import { Order } from '../../models/order';
import { AuthService } from '../../_services/auth.service';
import { TokenStorageService } from '../../_services/token-storage.service';

@Component({
  selector: 'app-board-vendor',
  templateUrl: './board-vendor.component.html',
  styleUrls: ['./board-vendor.component.css']
})
export class BoardVendorComponent implements OnInit {

  loading: boolean = false;
  anyOrderChanged: boolean = false;
  orders: Order[];
  map: any = new Map();
  isAllowedToViewPage: number = 0;
  tokenExpired: boolean = false;
  ordersMap = new Map();
  errorType: number = 0;
  
  constructor(
    private authService: AuthService, 
    private router: Router, 
    private tokenStorage: TokenStorageService, 
    private toastr: ToastrService) { }
  
  //CHECK IF VENDOR LOGGED IN, THEN GET ALL THE ORDERS
  ngOnInit(): void {
    if(!this.tokenStorage.getToken()){
      this.router.navigate(['login']);
    }
    this.authService.getOrdersForVendor().subscribe(data => {
      this.orders = data.body;
      console.log(data.body);
      data['body'].forEach((element: any, index: any) => {
        this.ordersMap.set(data['body'][index].orderId, index);
      });
    }, err => {
      //Authentication Failed
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
      this.toastr.error("Something went wrong", null, {closeButton: true});
      console.log(err);
    });
  }

  setShippingDate(): any{
    // if(shippingDate){
    //   const getShippingDate = shippingDate.substr(8, 2) + "-" + this.monthArray.indexOf(shippingDate.substr(4, 3)) + "-" + shippingDate.substr(24, 4);
    //   return shippingDate.substr(0, 10);
    // }
    return null;
  }

  //CHANGE THE SHIPPING DATE ACCORDING TO DATABASE FORMAT
  getShippingDate(shippingDate: string, orderDate: Date, orderId: number): any {
    console.log(shippingDate, new Date(shippingDate).getDate, orderDate.getDate);
    const datePayload =  new Date(shippingDate);
    this.map.set(orderId, new Date(shippingDate));
    this.anyOrderChanged = true;
    return shippingDate;
  }

  updateOrders(): void {
    this.loading = true;
    if(this.map.size == 0){
      return;
    }

    this.map.forEach((element: any, index: any) => {
      const updatedOrder = this.orders[this.ordersMap.get(index)];
      updatedOrder.shippedDate = element;
      console.log(updatedOrder);
      this.authService.updateOrderByVendor(index, updatedOrder).subscribe(data => {
        //console.log(data, this.orders[this.ordersMap.get(data.orderId)]);
        this.loading = false;
        this.orders[this.ordersMap.get(data.orderId)].shippedDate = data.shippedDate;
        
        
      }, err => {
        this.loading = false;
        this.toastr.error("Failed to update the order", null, {closeButton: true});
        console.log(err);
      });
    });
    //this.toastr.success(" orders updated successfully", null, {closeButton: true});
  }

}
