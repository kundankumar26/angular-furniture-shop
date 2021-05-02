import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Order } from '../models/order';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css']
})
export class OrderItemComponent implements OnInit {

  order: Order[] = [];
  form: any = {};
  index: number = 0;
  employeeShippingAddress: string;
  employeePhoneNumber: number;

  map: any = new Map();
  unorderedItems: string[] = [];
  orderedItems: string[] = [];

  buttonMDisabled = false;
  buttonKeyboardDisabled: boolean = false;
  buttonMouseDisabled: boolean = false;
  buttonChairDisabled: boolean = false;
  buttonTableDisabled: boolean = false;
  isLoggedIn: boolean = false;
  loading: boolean = false;
  orderPlaced: number = 0;
  orderNotPlaced: number = 0;
  shippingAddressError: string;

  constructor(private tokenStorageService: TokenStorageService, private router: Router, 
    private authService: AuthService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    console.log(this.tokenStorageService.getToken());
    this.index = 0;
    
  }

  addLGMonitor(status: boolean) {

    this.buttonMDisabled = status;
    this.map.set("LG Monitor", 1);
  }

  addHPMonitor(status: boolean) {

    this.buttonMDisabled = status;
    this.map.set("HP Monitor", 1);
  }

  addMouser(status: boolean) {

    this.buttonMouseDisabled = status;
    this.map.set("Mouse", 1);
  }

  addKeybord(status: boolean) {

    this.buttonKeyboardDisabled = status;
    this.map.set("Keyboard", 1);
  }

  addchair(status: boolean) {

    this.buttonChairDisabled = status;
    this.map.set("Chair", 1);
  }

  addtable1(status: boolean) {

    this.buttonTableDisabled = status;
    this.map.set("Table 1", 1);
  }

  addtable2(status: boolean) {

    this.buttonTableDisabled = status;
    this.map.set("Table 2", 1);
  }


  clearArray() {

    while (this.order.length) {
      this.order.pop();
    }
  }

  confirmOrder() {
    if(!this.isLoggedIn){
      return;
    }
    console.log("confirmOrder " + this.map.size);
    if (this.map.size != 0) {
      var T = document.getElementById("TestsDiv");
      T.style.display = "block";
    }
  }

  addToCart() {
    this.loading = true;
    this.shippingAddressError = null;
    this.orderNotPlaced = 0;
    this.orderPlaced = 0;

    // document.getElementById("TestsDiv").style.display = "none";
    // document.getElementById("Items-list").style.display = "none";
    console.log("this is start map ", this.map);

    const payload: Order[] = [];
    this.unorderedItems = [];
    this.orderedItems = [];

    this.map.forEach((element: any, index: string) => {
      this.map.set(index, 1);
      const order1 = new Order();
      order1.itemRequested = index;
      order1.phnNo = this.employeePhoneNumber;
      order1.shippingAddress = this.employeeShippingAddress;
      order1.qty = 1;
      payload.push(order1);
    });
    
    this.authService.createOrderForEmployee(payload).subscribe(data => {
      this.loading = false;
      this.orderPlaced = data.length;
      this.orderNotPlaced = this.map.size - this.orderPlaced;
      this.clearOrderedProductsFromMap(data);

      console.log(data, this.map);
    }, err => {
      this.clearOrderedProductsFromMap(err);
      this.loading = false;
      if(err.error.error == 'Unauthorized'){
        this.tokenStorageService.signOut();
        this.router.navigate(['login']);
        return;
      }
      if(err.status == 406){
        this.shippingAddressError = err.error.message;
      }
      //console.log(err, err.status);
    });
    console.log(this.orderPlaced, this.orderNotPlaced, this.orderedItems, this.unorderedItems);
    this.clearArray();
  }
  clearOrderedProductsFromMap(data: any) {
    data.forEach((element: any) => {
      //console.log(element, element.itemRequested);
      this.orderedItems.push(" " + element.itemRequested);
      this.map.set(element.itemRequested, 2);
    });
    console.log(this.map);
    this.map.forEach((element: any, index: string) => {
      if(element == 1){
        this.unorderedItems.push(" " + index);
      }
    });
  }

  Remove(emporder: any) {

    switch (emporder) {

      case "LG Monitor": {

        this.addLGMonitor(false);
        break;
      }
      case "HP Monitor": {

        this.addHPMonitor(false);
        break;
      }
      case "Mouse": {

        this.addMouser(false)
        break;
      }
      case "Keyboard": {

        this.addKeybord(false);
        break;
      }
      case "Chair": {

        this.addchair(false)
        break;
      }
      case "Table 1": {

        this.addtable1(false)
        break;
      }
      case "Table 2": {

        this.addtable2(false)
        break;
      }
    }

    this.map.delete(emporder);
    console.log("Inside Remove button " + emporder + " tota qty = " + this.map);
  }

}