import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {

  productForm: FormGroup;
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.productForm = new FormGroup({
      productName: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      productCategory: new FormControl(null, [Validators.required]),
      productPrice: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      productDescription: new FormControl(null, [Validators.required, Validators.minLength(5)]),
      productQty: new FormControl(null, [Validators.required, Validators.pattern("^[0-9]*$")]),
      productImageUrl: new FormControl(null, [Validators.required, Validators.pattern("([^\\s]+(\\.(jpe?g|png|gif|bmp))$)")]),
    });
  }

  get form() {
    return this.productForm.controls;
  }

  createProduct(formValue: any){
    this.authService.createProductByVendor(formValue).subscribe((res) => {
      console.log(res);
      this.toastr.success("1 product created successfully");
      this.productForm.reset();
    }, err => {
      console.log(err);
      this.toastr.error("Failed to create the order");
    });
  }

}
