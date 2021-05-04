import { Component, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-table-row',
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.css']
})
export class TableRowComponent implements OnInit {

  @Input() order: any;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  switchon(){
    console.log(this.order);
  }

  isDisabled(value: number): boolean {
    return value == 0 ? false : true;
  }

  ifAcceptedByAdmin(isRejectedByAdmin: number): string{
    return isRejectedByAdmin == 1 ? "Approved" : "Rejected";
  }

  acceptOrder(orderId: number, qty: number){
    this.authService.acceptOrderByAdmin(orderId, qty).subscribe(data => {
      console.log(data['body']);
      this.order.isRejectedByAdmin = 1;
    }, err => {
      console.log(err);
    });
  }

  rejectOrder(orderId: number, qty: number){
    this.authService.rejectOrderByAdmin(orderId, qty).subscribe(data => {
      //console.log(data);
      this.order.isRejectedByAdmin = 2;
    }, err => {
      console.log(err);
    });
  }

}
