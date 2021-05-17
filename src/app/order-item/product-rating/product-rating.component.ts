import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-product-rating',
  templateUrl: './product-rating.component.html',
  styleUrls: ['./product-rating.component.css']
})
export class ProductRatingComponent implements OnInit {

  @Input() productId: number;
  @Output() newComment: EventEmitter<Comment> = new EventEmitter<Comment>();
  ratingValue: number = 1;
  showRatingText: string = null;
  ratingDesc: string = null;
  commentId: number = 0;
  isRated: boolean = false;
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.params.id;
    this.authService.getCommentByUser(this.productId).subscribe(data => {
      console.log(data);
      if(data.body.commentId != null){
        this.isRated = true;
        this.commentId = data.body.commentId;
        this.ratingDesc = data.body.comment;
        this.ratingValue = data.body.rating;
      }
    }, err => {
      console.log(err);
    });
  }

  setRatingStar(value: number){
    this.ratingValue = value;
    if(this.ratingValue == 1){
      this.showRatingText = 'Very Bad';
    } else if(this.ratingValue == 2){
      this.showRatingText = 'Bad';
    } else if(this.ratingValue == 3){
      this.showRatingText = 'Good';
    } else if(this.ratingValue == 4){
      this.showRatingText = 'Very Good';
    } else if(this.ratingValue == 5){
      this.showRatingText = 'Excellent';
    }
  }

  submitReview(){
    //console.log(this.ratingValue, this.ratingDesc, this.isRated, this.commentId);
    if(this.ratingDesc==null || this.ratingDesc.length < 5){
      return;
    }
    this.loading = true;
    const payload = {
      "rating": this.ratingValue,
      "comment": this.ratingDesc,
      "productId": this.productId,
      "commentId": this.commentId,
    }

    if(this.isRated){
      this.authService.updateCommentForProduct(payload).subscribe(data => {
        console.log(data);
        this.toastr.success('Updated successfully', null, {closeButton: true});
        this.emitComment(payload);
      }, err => {
        this.toastr.error('Failed to update', null, {closeButton: true});
        console.log('inside ', err);
      });

    } else {

      this.authService.addCommentToProduct(this.productId, payload).subscribe(data => {
        console.log(data);
        this.loading = false;
        this.toastr.success('Comment added successfully', null, {closeButton: true});
        this.emitComment(payload);
      }, err => {
        this.loading = false;
        this.toastr.error('Failed to add comment', null, {closeButton: true});
        console.log(err);
      });
    }
    
  }
  emitComment(payload: any) {
    this.newComment.emit(payload);
  }

}
