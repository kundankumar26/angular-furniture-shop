import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../models/order';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-board-vendor',
  templateUrl: './board-vendor.component.html',
  styleUrls: ['./board-vendor.component.css']
})
export class BoardVendorComponent implements OnInit, OnChanges {

  loading: boolean = false;
  anyOrderChanged: boolean = false;
  monthArray: string[] = [' ', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  orders: Order[];
  map: any = new Map();
  updatedItems: any;
  isAllowedToViewPage: number = 0;
  errorMessage: string = '';
  tokenExpired: boolean = false;
  
  constructor(private authService: AuthService, private router: Router, private tokenStorage: TokenStorageService) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  //CHECK IF VENDOR LOGGED IN, THEN GET ALL THE ORDERS
  ngOnInit(): void {
    if(!window.sessionStorage.getItem('auth-token')){
      this.router.navigate(['login']);
    }
    this.authService.getOrdersForVendor().subscribe(data => {
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

  setShippingDate(shippingDate: string): any{
    if(shippingDate){
      const getShippingDate = shippingDate.substr(8, 2) + "-" + this.monthArray.indexOf(shippingDate.substr(4, 3)) + "-" + shippingDate.substr(24, 4);
      return shippingDate.substr(0, 10);
    }
    return null;
  }

  //CHANGE THE SHIPPING DATE ACCORDING TO DATABASE FORMAT
  getShippingDate(shippingDate: string, orderId: number): any {
    //console.log(shippingDate.split("-"), shippingDate.split("-").reverse(), shippingDate.split("-").reverse().join("-"));
    const datePayload =  shippingDate.split("-").reverse().join("-");
    console.log(new Date(), shippingDate);
    this.map.set(orderId, datePayload);
    this.anyOrderChanged = true;
    return shippingDate;
  }

  updateOrders(): void {
    this.loading = true;
    this.map.forEach((element: any, index: any) => {
      //console.log(element, index);
      this.authService.updateOrderByVendor(index, element).subscribe(data => {
        this.loading = false;
        this.updatedItems = data.size;
        console.log(data);
        window.location.reload();
      }, err => {
        this.loading = false;
        this.errorMessage = err.error.message;
        console.log(err);
      });
    });
  }

}
