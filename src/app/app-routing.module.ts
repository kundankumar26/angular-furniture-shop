import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminViewAllComponent } from './admin/admin-view-all/admin-view-all.component';
import { BoardAdminComponent } from './admin/board-admin/board-admin.component';
import { CreateProductComponent } from './board-vendor/create-product/create-product.component';
import { BoardVendorComponent } from './board-vendor/vendor-order-board/board-vendor.component';
import { CartComponent } from './employee/cart/cart.component';
import { ConfirmationPageComponent } from './employee/confirmation-page/confirmation-page.component';
import { EmployeeComponent } from './employee/employee-order-board/employee.component';
import { WishlistComponent } from './employee/wishlist/wishlist.component';
import { HomeComponent } from './order-item/home/home.component';
import { ProductDetailComponent } from './order-item/product-detail/product-detail.component';
import { OrderComponent } from './order/order.component';
import { AuthGuardService } from './_services/auth-guard.service';
import { EmployeeGuardService } from './_services/employee-guard.service';
import { RoleGuardService } from './_services/role-guard.service';

const routes: Routes = [
  {path: 'signup', component: OrderComponent, canActivate: [AuthGuardService]},
  {path: 'login', component: OrderComponent, canActivate: [AuthGuardService]},
  {path: 'confirm-account', component: ConfirmationPageComponent},
  {path: 'home', component: HomeComponent},
  {path: 'products/:id', component: ProductDetailComponent},
  {path: 'employee', component: EmployeeComponent, canActivate: [RoleGuardService]},
  {path: 'employee/cart', component: CartComponent, canActivate: [EmployeeGuardService]},
  {path: 'employee/wishlist', component: WishlistComponent, canActivate: [EmployeeGuardService]},
  {path: 'vendor', component: BoardVendorComponent, canActivate: [RoleGuardService]},
  {path: 'vendor/create-product', component: CreateProductComponent, canActivate: [RoleGuardService]},
  {path: 'admin', component: BoardAdminComponent, canActivate: [RoleGuardService]},
  {path: 'admin/view-all', component: AdminViewAllComponent, canActivate: [RoleGuardService]},
  {path: '', redirectTo: 'orders', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
