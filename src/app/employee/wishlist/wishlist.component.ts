import { Component, OnInit } from '@angular/core';
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
    
  ) { }

  ngOnInit(): void {
    this.authService.getProductsFromWishlist().subscribe(data => {
      this.wishList = data.body.wishList;
      this.productList = data.body.productList;
      console.log(this.wishList, this.productList);
    }, err => {
      console.log(err);
    });
  }

}
