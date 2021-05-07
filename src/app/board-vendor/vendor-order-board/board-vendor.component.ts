import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
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
  monthArray: string[] = [' ', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  orders: Order[];
  map: any = new Map();
  updatedItems: any;
  isAllowedToViewPage: number = 0;
  errorMessage: string = '';
  tokenExpired: boolean = false;
  ordersMap = new Map();
  errorOccured: boolean = false;
  orderUpdatedSuccess: boolean = false;
  
  constructor(private authService: AuthService, private router: Router, private tokenStorage: TokenStorageService) { }
  
  //CHECK IF VENDOR LOGGED IN, THEN GET ALL THE ORDERS
  ngOnInit(): void {
    if(!window.sessionStorage.getItem('auth-token')){
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

  setShippingDate(): any{
    // if(shippingDate){
    //   const getShippingDate = shippingDate.substr(8, 2) + "-" + this.monthArray.indexOf(shippingDate.substr(4, 3)) + "-" + shippingDate.substr(24, 4);
    //   return shippingDate.substr(0, 10);
    // }
    return null;
  }

  //CHANGE THE SHIPPING DATE ACCORDING TO DATABASE FORMAT
  getShippingDate(shippingDate: string, orderId: number): any {
    const datePayload =  shippingDate.split("-").reverse().join("-");
    this.map.set(orderId, datePayload);
    this.anyOrderChanged = true;
    return shippingDate;
  }

  updateOrders(): void {
    this.loading = true;
    this.orderUpdatedSuccess = false;

    this.map.forEach((element: any, index: any) => {
      this.authService.updateOrderByVendor(index, element).subscribe(data => {
        this.loading = false;
        this.updatedItems = data.size;
        this.orders[this.ordersMap.get(data.orderId)].shippedDate = data.shippedDate;
        this.orderUpdatedSuccess = true;
        console.log(data, this.orders[this.ordersMap.get(data.orderId)]);
      }, err => {
        this.orderUpdatedSuccess = false;
        this.loading = false;
        this.errorOccured = true;
        this.errorMessage = err.error.message;
        console.log(err);
      });
    });
  }

}
