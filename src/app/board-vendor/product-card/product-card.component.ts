import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {

  @Input() product: Product;
  @Output() addtowishlist: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() productClicked: EventEmitter<Product> = new EventEmitter<Product>();

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  emitProductID(currentProduct: Product){
    this.productClicked.emit(currentProduct);
  }

  addToWishlist(currentProduct: Product){
    // console.log(productId);
    // this.authService.addProductToWishlist(productId).subscribe(data => {
    //   this.toastr.success('Added to wishlist', null, {closeButton: true});
    // }, err => {
    //   this.toastr.error('Failed to add to wishlist', null, {closeButton: true});
    //   console.log(err);
    // });
    this.addtowishlist.emit(currentProduct);
  }

}
