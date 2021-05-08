import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StarRatingComponent } from 'ng-starrating';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponentService } from '../header/header-component.service';
import { EmployeeRequestPayload } from '../models/EmployeeRequestPayload';
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
  employeePhoneNumber: string;
  isUserEmployee: boolean = false;

  map: any = new Map();
  unorderedItems: string[] = [];
  orderedItems: string[] = [];

  isLoggedIn: boolean = false;
  loading: boolean = false;
  orderPlaced: number = 0;
  orderNotPlaced: number = 0;
  shippingAddressError: string;

  products: Product[] = [];
  employeeCartMap = new Map();
  filteredList: Product[] = [];
  sortBy: string = 'name';
  searchText: string;
  screenLoading: boolean = true;

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

      setTimeout(() => {
        console.log('sleep');
        this.screenLoading = false;
      }, 1000);

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
    } else if(this.sortBy == 'lowToHigh'){
      this.products.sort(sortByPriceLowToHigh);
    } else if(this.sortBy == 'highToLow'){
      this.products.sort(sortByPriceHighToLow);
    } else {
      this.products.sort(sortByPopularity);
    }
  }

  addProduct(productId: number, productName: string){
    this.employeeCartMap.set(productId, productName);
    this.map.set(productId, productName);
    console.log(productId, productName);
  }

  isAddedToCart(productId: number){
    if(this.map.get(productId) != null){
      return true;
    }
    return false;
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

    const payload: EmployeeRequestPayload[] = [];
    this.unorderedItems = [];
    this.orderedItems = [];

    this.employeeCartMap.forEach((element: string, index: number) => {
      const orderRequest = new EmployeeRequestPayload();
      orderRequest.productId = index;
      orderRequest.qty = 1;
      payload.push(orderRequest);
    });
    if(payload != null){
      payload[0].address = this.employeeShippingAddress;
      payload[0].phoneNumber = this.employeePhoneNumber;
    }
    console.log(this.employeeCartMap);

    this.authService.createOrderForEmployee(payload).subscribe(data => {
      this.loading = false;
      this.orderPlaced = data.body.length;
      this.showToastMessage(this.orderPlaced, payload.length - this.orderPlaced);
      
      console.log(data);
    }, err => {
      this.loading = false;
      if(err.error.error == 'Unauthorized'){
        this.tokenStorageService.signOut();
        this.router.navigate(['login']);
        return;
      }
      if(err.status == 404){
        this.toastr.error(err.error.message, null, {closeButton: true});
      } else{
        this.shippingAddressError = err.error.message;
        this.showToastMessage(this.orderPlaced, payload.length - this.orderPlaced);
      }
      console.log(err);
    });
    this.clearArray();
  }

  showToastMessage(orderPlaced: number, orderNotPlaced: number){
    if(orderPlaced > 0){
      this.toastr.success(orderPlaced + " item ordered successfully.", null, {closeButton: true});
    }
    if(orderNotPlaced > 0){
      console.log(orderNotPlaced);
      this.toastr.error(orderNotPlaced + " item already ordered.", null, {closeButton: true});
    }
  }

  Remove(emporder: any) {
    this.employeeCartMap.delete(emporder);
    this.isAddedToCart(emporder);
    console.log("Inside Remove button " + emporder + " tota qty = " + this.map);
  }

  getProduct(product: Product){
    console.log(product?.productId, product?.productName);
    this.addProduct(product?.productId, product?.productName);
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

function sortByPopularity(p1: Product, p2: Product) {
  if(p1.productRating < p2.productRating) return 1;
  else if(p1.productRating == p2.productRating) return 0;
  else return -1;
}

