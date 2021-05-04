import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardAdminComponent } from './admin/board-admin/board-admin.component';
import { BoardVendorComponent } from './board-vendor/board-vendor.component';
import { EmployeeComponent } from './employee/employee.component';
import { LoginComponent } from './login/login.component';
import { OrderItemComponent } from './order-item/order-item.component';
import { OrderComponent } from './order/order.component';
import { RegisterComponent } from './register/register.component';
import { ViewOrderComponent } from './view-order/view-order.component';
import { AuthGuardService } from './_services/auth-guard.service';
import { RoleGuardService } from './_services/role-guard.service';

const routes: Routes = [
  {path: 'signup', component: RegisterComponent, canActivate: [AuthGuardService], data: {expectedRole: 'none'}},
  {path: 'login', component: LoginComponent, canActivate: [AuthGuardService], data: {expectedRole: 'none'}},
  {path: 'orders', component: OrderItemComponent, canActivate: [AuthGuardService], data: {expectedRole: 'ROLE_EMPLOYEE'}},
  {path: 'create-order', component: ViewOrderComponent, canActivate: [AuthGuardService,]},
  {path: 'employee', component: EmployeeComponent, canActivate: [RoleGuardService]},
  {path: 'vendor', component: BoardVendorComponent, canActivate: [RoleGuardService]},
  {path: 'admin', component: BoardAdminComponent, canActivate: [RoleGuardService]},
  {path: '', redirectTo: 'orders', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
