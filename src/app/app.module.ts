import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrderComponent } from './order/order.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BoardVendorComponent } from './board-vendor/vendor-order-board/board-vendor.component';
import { BoardAdminComponent } from './admin/board-admin/board-admin.component';
import { EmployeeComponent } from './employee/employee-order-board/employee.component';
import { HeaderComponent } from './header/header.component';
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
import { ProductCardComponent } from './order-item/product-card/product-card.component';
import { ConfirmationPageComponent } from './employee/confirmation-page/confirmation-page.component';
import { WishlistComponent } from './employee/wishlist/wishlist.component';
import { HomeComponent } from './order-item/home/home.component';
import { ProductDetailComponent } from './order-item/product-detail/product-detail.component';
import { ProductRatingComponent } from './order-item/product-rating/product-rating.component';
import { SlideComponent } from './order-item/slide/slide.component';

@NgModule({
  declarations: [
    AppComponent,
    OrderComponent,
    BoardVendorComponent,
    BoardAdminComponent,
    EmployeeComponent,
    HeaderComponent,
    AdminViewAllComponent,
    CreateProductComponent,
    CartComponent,
    StarComponent,
    ErrorComponent,
    ProductCardComponent,
    ConfirmationPageComponent,
    WishlistComponent,
    HomeComponent,
    ProductDetailComponent,
    ProductRatingComponent,
    SlideComponent,
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
