import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Order } from 'src/app/models/order';
import { AuthService } from 'src/app/_services/auth.service';
import { SharedService } from 'src/app/_services/shared.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  orders: Order[];
  clickEventsubscription: any;
  isAllowedToViewPage: number = 0;
  tokenExpired: boolean = false;
  errorType: number = 0;
  showErrorBoard: boolean = false;
  
  constructor(
    private authService: AuthService, 
    private router: Router, 
    private sharedService: SharedService,
    private tokenStorage: TokenStorageService, 
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    if(!this.tokenStorage.getToken()){
      this.router.navigate(['login']);
    }
    this.ngxLoader.startBackground();
    
    this.authService.getOrdersForEmployee().subscribe(data => {
      this.orders = data.body;
      this.ngxLoader.stopAll();
      this.showErrorBoard = true;
    }, err => {
      this.ngxLoader.stopAll();
      this.showErrorBoard = true;
      //Authentication Failed
      if(err.error.status == 401){
        this.errorType = 404;
        this.tokenExpired = true;
        this.tokenStorage.signOut();
      }
      //Access not Authorised
      if(err.error.status == 403){
        this.errorType = 403;
        return;
      }
      
      this.toastr.error("Something went wrong", null, {closeButton: true});
      console.log(err);
    });
  }

  showDate(orderDate: Date, shippedDate: Date, deliveryDate: Date){
    if(deliveryDate != null){
      return deliveryDate;
    } else if(shippedDate != null){
      return shippedDate;
    }
    return orderDate;
  }

  calculatePrice(price: number, qty: number){
    return price * 0.18 + price*qty;
  }

}
