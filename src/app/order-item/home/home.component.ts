import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponentService } from 'src/app/header/header-component.service';
import { Cart } from 'src/app/models/cart';
import { Product } from 'src/app/models/product';
import { Wishlist } from 'src/app/models/wishlist';
import { AuthService } from 'src/app/_services/auth.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  isLoggedIn: boolean = false;

  products: Product[] = [];
  cartSet: any = new Set();
  wishlistSet: any = new Set();
  sortBy: string = 'name';
  searchText: string;
  screenLoading: boolean = true;

  constructor(
    private tokenStorageService: TokenStorageService, 
    private router: Router, 
    private authService: AuthService,
    private toastr: ToastrService,
    private headerComponentService: HeaderComponentService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    this.authService.getAllProducts().subscribe(data => {
      if(this.isLoggedIn){
        data.body.cartList.forEach((element: Cart) => {
          this.cartSet.add(element.productId);
        });
        data.body.wishlists.forEach((element: Cart) => {
          this.wishlistSet.add(element.productId);
        });
        this.products = data.body.productList;
        console.log(this.cartSet, this.wishlistSet);
      } else {
        this.products = data.body;
      }
      
      console.log(data);
      // setTimeout(() => {
      //   console.log('sleep');
      //   this.screenLoading = false;
      // }, 1000);
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

  getProduct(product: Product){
    this.authService.addProductToCart(product?.productId).subscribe(data => {
      this.cartSet.add(product?.productId);
      this.toastr.success('Added to cart', null, {closeButton: true});
      console.log(data);
    }, err => {
      this.toastr.error('Failed to add to cart', null, {closeButton: true});
      console.log(err);
    })
  }

  getWishlistId(productId: number){
    this.authService.addProductToWishlist(productId).subscribe(data => {
      console.log(data);
      if(this.wishlistSet.has(productId)){
        this.wishlistSet.delete(productId);
        this.toastr.error('Removed from wishlist', null, {closeButton: true});
      } else {
        this.wishlistSet.add(productId);
        this.toastr.success('Added to wishlist', null, {closeButton: true});
      }
    }, err => {
      console.log(err);
    });
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
