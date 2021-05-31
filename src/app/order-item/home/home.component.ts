import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponentService } from 'src/app/header/header-component.service';
import { Cart } from 'src/app/models/cart';
import { Product } from 'src/app/models/product';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from 'src/app/_services/auth.service';
import { SliderService } from 'src/app/_services/slider.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { IImage } from 'src/app/models/iimage';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  images: any = [
              'https://cdn.pixabay.com/photo/2017/11/27/21/31/computer-2982270_1280.jpg',
              'https://cdn.pixabay.com/photo/2016/02/17/15/37/laptop-1205256_1280.jpg',
              'https://cdn.pixabay.com/photo/2017/10/08/23/26/apple-2831949_1280.png',
              'https://cdn.pixabay.com/photo/2017/05/24/21/33/workplace-2341642_1280.jpg',
              'https://cdn.pixabay.com/photo/2017/03/28/12/11/chairs-2181960_1280.jpg',
              'https://cdn.pixabay.com/photo/2017/03/28/12/16/tables-2181979_1280.jpg',
              'https://cdn.pixabay.com/photo/2014/05/03/00/46/notebook-336634_1280.jpg',
              'https://cdn.pixabay.com/photo/2016/11/18/13/02/bed-1834327_1280.jpg',
              'https://cdn.pixabay.com/photo/2015/01/08/18/24/children-593313_1280.jpg',
            ]
  tempProducts: Product[] = [
    {
      productId: 123,
      productCategory: 'Laptop',
      productName: 'HP Laptop',
      productPrice: 150000,
      productDescription: 'This is a very good laptop',
      productQty: 4,
      productRating: 4.3,
      productImageUrl: 'https://cdn.pixabay.com/photo/2014/05/02/21/49/laptop-336373_960_720.jpg'
    },
    {
      productId: 124,
      productCategory: 'Table',
      productName: 'LRX Table',
      productPrice: 15000,
      productDescription: 'This is a very good table for gamers',
      productQty: 1,
      productRating: 4.5,
      productImageUrl: 'https://cdn.pixabay.com/photo/2015/05/31/15/18/technology-792180_960_720.jpg'
    }
  ]

  isLoggedIn: boolean = false;

  products: Product[] = [];
  cartSet: any = new Set();
  wishlistSet: any = new Set();
  sortBy: string = 'name';
  searchText: string;
  screenLoading: boolean = true;
  showErrorBoard: boolean = false;

  constructor(
    private tokenStorageService: TokenStorageService, 
    private router: Router, 
    private authService: AuthService,
    private toastr: ToastrService,
    private headerComponentService: HeaderComponentService,
    private sliderService: SliderService,
    private spinner: NgxSpinnerService,
    private ngxLoader: NgxUiLoaderService,
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    this.spinner.show();
    this.ngxLoader.start();

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
      if(data.body.length == 0){
        this.products = this.tempProducts;
      }
      this.showErrorBoard = true;
      this.ngxLoader.stopAll();
      this.spinner.hide();
      console.log(data);
      // setTimeout(() => {
      //   console.log('sleep');
      //   this.screenLoading = false;
      // }, 1000);
    }, err => {
      this.showErrorBoard = true;
      this.spinner.hide();
      console.log(err);
    });

    this.headerComponentService.getSearchText().subscribe(data => {
      this.searchText = data;
    });

    this.sliderService.getSearchText().subscribe(data => {
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
