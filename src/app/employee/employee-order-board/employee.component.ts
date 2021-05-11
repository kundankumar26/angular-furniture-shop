import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
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
  
  constructor(
    private authService: AuthService, 
    private router: Router, 
    private sharedService: SharedService,
    private tokenStorage: TokenStorageService, 
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    if(!this.tokenStorage.getToken()){
      this.router.navigate(['login']);
    }
    this.authService.getOrdersForEmployee().subscribe(data => {
      this.orders = data.body;
    }, err => {
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

}
