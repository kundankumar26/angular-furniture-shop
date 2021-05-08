import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrderComponent } from './order/order.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ViewOrderComponent } from './view-order/view-order.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BoardVendorComponent } from './board-vendor/vendor-order-board/board-vendor.component';
import { BoardAdminComponent } from './admin/board-admin/board-admin.component';
import { EmployeeComponent } from './employee/employee.component';
import { HeaderComponent } from './header/header.component';
import { OrderItemComponent } from './order-item/order-item.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AgGridModule } from 'ag-grid-angular';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { AdminViewAllComponent } from './admin/admin-view-all/admin-view-all.component';
import { CreateProductComponent } from './board-vendor/create-product/create-product.component';
import { CartComponent } from './employee/cart/cart.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { StarComponent } from './order-item/star/star.component';
import { RatingModule } from 'ng-starrating';
import { ErrorComponent } from './error/error.component';
import { ProductCardComponent } from './board-vendor/product-card/product-card.component';

@NgModule({
  declarations: [
    AppComponent,
    OrderComponent,
    LoginComponent,
    RegisterComponent,
    ViewOrderComponent,
    BoardVendorComponent,
    BoardAdminComponent,
    EmployeeComponent,
    HeaderComponent,
    OrderItemComponent,
    AdminViewAllComponent,
    CreateProductComponent,
    CartComponent,
    StarComponent,
    ErrorComponent,
    ProductCardComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    Ng2SearchPipeModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    RatingModule,
    MDBBootstrapModule.forRoot(),
    AgGridModule.withComponents([]),
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
