import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../models/order';
import { AuthService } from '../_services/auth.service';

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
  
  constructor(private authService: AuthService, private router: Router) { }

  //CHECK IF VENDOR LOGGED IN, THEN GET ALL THE ORDERS
  ngOnInit(): void {
    if(!window.sessionStorage.getItem('auth-token')){
      this.router.navigate(['login']);
    }
    this.authService.getOrdersForVendor().subscribe(data => {
      this.orders = data.body;
    }, err => {
      console.log(err.error.message);
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
    this.map.set(orderId, datePayload);
    this.anyOrderChanged = true;
    return shippingDate;
  }

  changeOrders(orders: any){
    console.log(orders);
  }

  updateOrders(): void {
    this.loading = true;
    this.map.forEach((element: any, index: any) => {
      //console.log(element, index);
      this.authService.updateOrderByVendor(index, element).subscribe(data => {
        this.loading = false;
        window.location.reload(); 
      }, err => {
        this.loading = false;
        console.log(err);
      });
    });
  }

}
