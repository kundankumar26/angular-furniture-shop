import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminViewAllComponent } from './admin/admin-view-all/admin-view-all.component';
import { BoardAdminComponent } from './admin/board-admin/board-admin.component';
import { CreateProductComponent } from './board-vendor/create-product/create-product.component';
import { BoardVendorComponent } from './board-vendor/vendor-order-board/board-vendor.component';
import { CartComponent } from './employee/cart/cart.component';
import { ConfirmationPageComponent } from './employee/confirmation-page/confirmation-page.component';
import { EmployeeComponent } from './employee/employee.component';
import { LoginComponent } from './login/login.component';
import { OrderItemComponent } from './order-item/order-item.component';
import { OrderComponent } from './order/order.component';
import { RegisterComponent } from './register/register.component';
import { ViewOrderComponent } from './view-order/view-order.component';
import { AuthGuardService } from './_services/auth-guard.service';
import { EmployeeGuardService } from './_services/employee-guard.service';
import { RoleGuardService } from './_services/role-guard.service';

const routes: Routes = [
  {path: 'signup', component: OrderComponent, canActivate: [AuthGuardService]},
  {path: 'login', component: OrderComponent, canActivate: [AuthGuardService]},
  {path: 'confirm-account', component: ConfirmationPageComponent},
  {path: 'home', component: OrderItemComponent},
  {path: 'create-order', component: ViewOrderComponent, canActivate: [AuthGuardService,]},
  {path: 'employee', component: EmployeeComponent, canActivate: [RoleGuardService]},
  {path: 'employee/cart', component: CartComponent, canActivate: [EmployeeGuardService]},
  {path: 'vendor', component: BoardVendorComponent, canActivate: [RoleGuardService]},
  {path: 'vendor/create-product', component: CreateProductComponent, canActivate: [RoleGuardService]},
  {path: 'admin', component: BoardAdminComponent, canActivate: [RoleGuardService]},
  {path: 'admin/view-all', component: AdminViewAllComponent, canActivate: [RoleGuardService]},
  {path: 'order-page', component: OrderComponent},
  {path: '', redirectTo: 'orders', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
