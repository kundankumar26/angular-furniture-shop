import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/models/product';
import { Wishlist } from 'src/app/models/wishlist';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  wishList: Wishlist[] = [];
  productList: Product[] = [];

  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.authService.getProductsFromWishlist().subscribe(data => {
      this.wishList = data.body.wishList;
      this.productList = data.body.productList;
      console.log(data);
    }, err => {
      console.log(err);
    });
  }

  addToCart(productId: number){
    this.authService.addProductToCart(productId).subscribe(data => {
      this.toastr.success('Added to cart', null, {closeButton: true});
    }, err => {
      this.toastr.error('Failed to add to cart', null, {closeButton: true});
      console.log(err);
    });
  }

  removeFromWishlist(index: number){
    this.authService.removeFromWishlist(this.wishList[index].wishlistId).subscribe(data => {
      this.productList = this.productList.filter((element, i) => i != index);
      this.wishList = this.wishList.filter((element, i) => i != index);
      this.toastr.success('Removed from wishlist', null, {closeButton: true});
    }, err => {
      this.toastr.error('Failed to remove from wishlist', null, {closeButton: true});
      console.log(err);
    });
  }

}
