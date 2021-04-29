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

  orders: Order[];
  dt: Date[];

  setShippingDate(shippingDate: string): any{
    if(shippingDate){
      console.log(new Date(shippingDate));
      return shippingDate;
    }
    return null;
  }

  getShippingDate(shippingDate: any): any {
    //console.log(shippingDate);
    return shippingDate;
  }

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

  confirmOrder(orderId: number, date: string): void {
    console.log(date);
    if(date.length == 10 && date[2] == '-' && date[5] == '-'){
        for(let i=0;i<10;i++){
          if(i==2 || i==5){
            continue;
          } else if(date[i] >= '0' && date[i] <= '9'){
            continue;
          } else {
            console.log(date[i], i);
            return;
          }
        }
        console.log(date);
        // this.authService.updateOrderByVendor(orderId, date).subscribe(data => {
        //   console.log(data);
        //   window.location.reload(); 
        // }, err => {
        //   console.log(err);
        // });
      }
  }

}
