import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StarRatingComponent } from 'ng-starrating';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponentService } from '../header/header-component.service';
import { Order } from '../models/order';
import { Product } from '../models/product';
import { AuthService } from '../_services/auth.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css'],
  animations: [
    trigger('EnterLeave', [
      state('flyIn', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.5s 300ms ease-in')
      ]),
      transition(':leave', [
        animate('0.3s ease-out', style({ transform: 'translateX(100%)' }))
      ])
    ])]
})
export class OrderItemComponent implements OnInit {

  order: Order[] = [];
  form: any = {};
  index: number = 0;
  employeeShippingAddress: string;
  employeePhoneNumber: number;
  isUserEmployee: boolean = false;

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

  products: Product[] = [];
  employeeCartMap = new Map();
  filteredList: Product[] = [];
  sortBy: string;
  searchText: string;

  constructor(private tokenStorageService: TokenStorageService, private router: Router, 
    private authService: AuthService, private modalService: NgbModal, private toastr: ToastrService,
    private headerComponentService: HeaderComponentService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    this.index = 0;
    if(this.isLoggedIn){
      this.isUserEmployee = this.tokenStorageService.getUser().roles[0].includes('ROLE_EMPLOYEE');
    }
    this.authService.getAllProducts().subscribe(data => {
      //console.log(data['body']);
      this.products = data['body'];
      this.filteredList = data['body'];
      console.log(this.products);
    }, err => {
      console.log(err);
    });
    this.headerComponentService.getSearchText().subscribe(data => {
      this.searchText = data;
    });
  }

  sortByMethod(value: string){
    this.sortBy = value;
    if(this.sortBy == 'name'){
      this.products.sort(sortByName);
    } else if(this.sortBy == 'price_low_to_high'){
      this.products.sort(sortByPriceLowToHigh);
    } else {
      this.products.sort(sortByPriceHighToLow);
    }
  }


  addProduct(productId: number, productName: string){
    this.employeeCartMap.set(productId, productName);
    console.log(productId, productName);
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
    console.log("confirmOrder " + this.employeeCartMap.size);
    if (this.employeeCartMap.size != 0) {
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

    const payload: number[] = [];
    this.unorderedItems = [];
    this.orderedItems = [];

    this.employeeCartMap.forEach((element: string, index: number) => {
      console.log(index, element);
      payload.push(index);
    });
    
    this.authService.createOrderForEmployee(payload).subscribe(data => {
      this.loading = false;
      this.orderPlaced = data.length;
      this.orderNotPlaced = this.map.size - this.orderPlaced;
      this.clearOrderedProductsFromMap(data);

      console.log(data, this.map);
    }, err => {
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
    this.employeeCartMap.delete(emporder);
    console.log("Inside Remove button " + emporder + " tota qty = " + this.map);
  }

}

function sortByName(p1: Product, p2: Product) {
  if(p1.productName > p2.productName) return 1;
  else if(p1.productName == p2.productName) return 0;
  else return -1;
}

function sortByPriceLowToHigh(p1: Product, p2: Product) {
  if(p1.productPrice > p2.productPrice) return 1;
  else if(p1.productPrice === p2.productPrice) return 0;
  else return -1;
}

function sortByPriceHighToLow(p1: Product, p2: Product) {
  if(p1.productPrice < p2.productPrice) return 1;
  else if(p1.productPrice === p2.productPrice) return 0;
  else return -1;
}

