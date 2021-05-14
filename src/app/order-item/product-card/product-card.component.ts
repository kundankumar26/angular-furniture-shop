import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Cart } from 'src/app/models/cart';
import { Product } from 'src/app/models/product';
import { Wishlist } from 'src/app/models/wishlist';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {

  @Input() product: Product;
  @Input() cart: boolean;
  @Input() wishlist: boolean;

  @Output() productClicked: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() wishlistItem: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    console.log(this.cart, this.wishlist);
  }

  emitProductID(currentProduct: Product){
    this.productClicked.emit(currentProduct);
  }

  addToWishlist(productId: number){
    this.wishlistItem.emit(productId);
  }

}
