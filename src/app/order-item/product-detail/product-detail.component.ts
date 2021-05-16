import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  commentList: any[] = [];
  users: any[] = [];
  product: Product;
  showRatingBoard: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private ngxLoader: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.params.id;
    this.getUpdatedComments(productId);
  }

  toggleRatingBoard(){
    this.showRatingBoard = !this.showRatingBoard;
  }

  updateComment(comment: any){
    this.toggleRatingBoard();
    this.getUpdatedComments(comment.productId);
  }

  getUpdatedComments(productId: number){
    this.ngxLoader.start();
    this.authService.getCommentsForProduct(productId).subscribe(data => {
      console.log(data);
      this.commentList = data.body.commentList;
      this.users = data.body.users;
      this.product = data.body.product;
      this.ngxLoader.stop();
    }, err => {
      console.log(err);
      this.ngxLoader.stop();
    });
  }

  getQtyText(qty: number): string{
    if(qty == 0){
      return 'Sold out';
    } else if(qty < 10){
      return 'Hurry, only ' + qty + ' left';
    }
    return null;
  }

}
