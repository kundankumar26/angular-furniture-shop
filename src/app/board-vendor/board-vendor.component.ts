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

  monthArray: string[] = [' ', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  orders: Order[];
  dt: Date[];
  //datePayload: string;
  map: any = new Map();
  array: any = new Map() ;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if(!window.sessionStorage.getItem('auth-token')){
      this.router.navigate(['login']);
    }
    this.authService.getOrdersForVendor().subscribe(data => {
      this.orders = data.body;
      //console.log(data.body);
    }, err => {
      console.log(err.error.message);
    });
  }

  isDisabled(value: string): boolean {
    if(value!=null && value.length >=11)
      return true;
    return false;
  }

  setShippingDate(shippingDate: string): any{
    if(shippingDate){
      const getShippingDate = shippingDate.substr(8, 2) + "-" + this.monthArray.indexOf(shippingDate.substr(4, 3)) + "-" + shippingDate.substr(24, 4);
      //console.log(getShippingDate);
      //console.log((new Date(getShippingDate)).toDateString());
      return shippingDate.substr(0, 10);
    }
    return null;
  }

  getShippingDate(shippingDate: string, orderId: number): any {
    const datePayload =  shippingDate.split("-").reverse().join("-");
    console.log(datePayload);
    this.array.set(orderId, datePayload);
    //this.confirmOrder(orderDate);
    return shippingDate;
  }

  confirmOrder(): void {
    //console.log(orderId, this.datePayload);
    this.array.forEach((element: any, index: any) => {
      console.log(element, index);
      this.authService.updateOrderByVendor(index, element).subscribe(data => {
        console.log(data);
        window.location.reload(); 
      }, err => {
        console.log(err);
      });
    });
    
        
  }

}
