import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Cart } from 'src/app/models/cart';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  productList: Product[] = [];
  cartList: Cart[] = [];
  itemQty: any = new Map();
  subTotal: number = 0;
  tax: number = 0;
  deliveryCharge: number = 0;
  total: number = 0;
  showUserDetailBoard: boolean = false;
  address: string = null;
  phoneNumber: string = null;
  showError: string = null;
  loading: boolean = false;
  showCartImage: boolean = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private ngxLoader: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.ngxLoader.start();
    
    this.authService.getProductsFromCart().subscribe(data => {
      this.cartList = data.body.cartList;
      this.productList = data.body.productList;
      this.calculatePrice(this.productList);
      this.ngxLoader.stop();
      this.showCartImage = true;
      console.log("Data from server: ", data);
    }, err => {
      this.showCartImage = true;
      this.ngxLoader.stop();
      console.log(err);
    });


  }

  calculatePrice(productList: Product[]) {
    productList.forEach(element => {
      this.subTotal += element?.productPrice;
      console.log(element?.productPrice);
    });
    this.tax = 0.18 * this.subTotal;
    this.deliveryCharge = this.subTotal > 500 ? 0 : 40;
    this.total = Math.round(this.subTotal + this.tax + this.deliveryCharge);
    console.log(this.subTotal, this.tax, this.total);
  }

  deleteFromCart(itemIndex: number){
    this.authService.deleteFromCart(this.cartList[itemIndex].cartId).subscribe(data => {
      this.productList = this.productList.filter((element, index) => index != itemIndex);
      this.cartList = this.cartList.filter((element, index) => index != itemIndex);
      this.calculateNewPrice();
      this.toastr.success('Removed from cart', null, {closeButton: true});
    }, err => {
      console.log(err);
      this.toastr.error('Failed to remove from cart', null, {closeButton: true});
    });

  }

  getQty(productId: number, qty: number): number {
    if(qty > 5){
      this.toastr.error('Qty cannot be more than 5 for any product', null, {closeButton: true});
      return null;
    } else if(qty < 1){
      this.toastr.error('Qty cannot be less than 1 for any product', null, {closeButton: true});
      return null;
    }
    this.itemQty.set(productId, qty);
    this.calculateNewPrice();
    return qty;
  }

  calculateNewPrice() {
    this.subTotal = 0;
    this.productList.forEach((element: Product, index: number) => {
      const qty = this.itemQty.get(element.productId);
      this.subTotal += element.productPrice * (qty > 0 ? qty : 1);
    });
    this.tax = 0.18 * this.subTotal;
    this.deliveryCharge = this.subTotal > 500 ? 0 : 40;
    this.total = Math.round(this.subTotal + this.tax + this.deliveryCharge);
  }

  showAddressBoard(): void {
    console.log(this.itemQty);
    this.showUserDetailBoard = !this.showUserDetailBoard;
  }

  placeOrder(){
    if(this.checkAddressPhone()){
      return;
    }
    this.loading = true;
    const productIds: number[] = [];
    const qty: number[] = [];
    this.productList.forEach((element) => {
      const itemQty = this.itemQty.get(element.productId);
      qty.push(itemQty > 0 ? itemQty : 1);
      productIds.push(element.productId);
    });

    const payload = {
      "productIds": productIds,
      "qty": qty,
      "address": this.address,
      "phoneNumber": this.phoneNumber
    }

    this.authService.createOrderForEmployee(payload).subscribe(data => {
      console.log(data);
      this.loading = false;
      this.toastr.success(data.body.length + ' items ordered successfully.', null, {closeButton: true});
      this.router.navigate(['employee']);
    }, err => {
      this.loading = false; 
      if(err.status == 404){
        this.toastr.error(err.error.message, null, {closeButton: true});
        return;
      }
      this.toastr.error(err.error.message, null, {closeButton: true});
      console.log(err);
    });
    console.log(qty, productIds, this.address, this.phoneNumber);
  }

  checkAddressPhone(): boolean {
    if(this.address == null || this.address.length < 5){
      this.showError = "Address is too short";
      return true;
    } else if(this.phoneNumber == null || this.phoneNumber.length < 10){
      this.showError = "Phone number is too short";
      return true;
    } else if(this.phoneNumber == null || this.phoneNumber.length > 10){
      this.showError = "Phone number is too long";
      return true;
    }
    this.showError = null;
    return false;
  }


}
