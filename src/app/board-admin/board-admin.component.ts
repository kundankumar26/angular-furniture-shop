import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../models/order';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {

  orders: Order[];
  _isDisabled: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if(!window.sessionStorage.getItem('auth-token')){
      this.router.navigate(['login']);
    }
    this.authService.getOrdersForAdmin().subscribe(data => {
      this.orders = data.body;
      //console.log(data.body);
    }, err => {
      console.log(err.error.message);
    });
  }

  acceptOrder(orderId: number, qty: number){
    this.authService.acceptOrderByAdmin(orderId, qty).subscribe(data => {
      console.log(data);
      this.reloadPage();
    }, err => {
      console.log(err);
    });
  }

  rejectOrder(orderId: number, qty: number){
    this.authService.rejectOrderByAdmin(orderId, qty).subscribe(data => {
      console.log(data);
      this.reloadPage();
    }, err => {
      console.log(err);
    });
  }

  isDisabled(value: number): boolean {
    return value == 0 ? false : true;
  }

  reloadPage(){
    window.location.reload();
  }
}
