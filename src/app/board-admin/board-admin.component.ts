import { Component, OnInit } from '@angular/core';
import { Order } from '../models/order';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {

  orders: Order[];

  constructor() { }

  ngOnInit(): void {
    this.orders = [
      {
        orderId: 13,
        empId: 1,
        empName: "akshay kumar",
        email: "akshay@gmail.com",
        itemRequested: "human",
        qty: 1,
        shippingAddress: "banglore",
        shippedDate: null,
        phnNo: 0,
        orderDate: "Thu, 22 Apr 2021 15:35:12 IST",
        isRejectedByAdmin: 0
    },
    {
      orderId: 13,
      empId: 1,
      empName: "akshay kumar",
      email: "akshay@gmail.com",
      itemRequested: "human",
      qty: 1,
      shippingAddress: "banglore",
      shippedDate: null,
      phnNo: 0,
      orderDate: "Thu, 22 Apr 2021 15:35:12 IST",
      isRejectedByAdmin: 0
  },
  {
    orderId: 13,
    empId: 1,
    empName: "akshay kumar",
    email: "akshay@gmail.com",
    itemRequested: "human",
    qty: 1,
    shippingAddress: "banglore",
    shippedDate: null,
    phnNo: 0,
    orderDate: "Thu, 22 Apr 2021 15:35:12 IST",
    isRejectedByAdmin: 0
},{
  orderId: 13,
  empId: 1,
  empName: "akshay kumar",
  email: "akshay@gmail.com",
  itemRequested: "human",
  qty: 1,
  shippingAddress: "banglore",
  shippedDate: null,
  phnNo: 0,
  orderDate: "Thu, 22 Apr 2021 15:35:12 IST",
  isRejectedByAdmin: 0
}
    ]
  }

  acceptOrder(isRejectedByAdmin: number){
    console.log(isRejectedByAdmin);

  }

  rejectOrder(isRejectedByAdmin: number){
    console.log(isRejectedByAdmin);
  }
}
