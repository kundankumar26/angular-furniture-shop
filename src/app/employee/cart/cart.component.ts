import { Component, Input, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  @Input() productsArray: Product[] = [];
  products: Product[] = [];

  constructor() { }

  ngOnInit(): void {
    console.log(this.products);
  }

}
