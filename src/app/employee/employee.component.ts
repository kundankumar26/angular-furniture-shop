import { Component, OnInit } from '@angular/core';
import { Order } from '../models/order';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

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
        shippedDate: "Thu, 22 Apr 2021 15:35:12 IST",
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

}
