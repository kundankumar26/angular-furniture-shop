import { Component, Input, OnInit } from '@angular/core';
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

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.getProductsFromCart().subscribe(data => {
      this.cartList = data.body.cartList;
      this.productList = data.body.productList;
      console.log(this.cartList, this.productList);
    }, err => {
      console.log(err);
    });
  }

  deleteFromCart(value: number){
    console.log(value);
    this.productList = this.productList.filter((element, index) => index != value);
    this.cartList = this.cartList.filter((element, index) => index != value);
  }

}
