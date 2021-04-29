import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardVendorComponent } from './board-vendor/board-vendor.component';
import { EmployeeComponent } from './employee/employee.component';
import { LoginComponent } from './login/login.component';
import { OrderComponent } from './order/order.component';
import { RegisterComponent } from './register/register.component';
import { ViewOrderComponent } from './view-order/view-order.component';

const routes: Routes = [
  {path: 'signup', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'orders', component: OrderComponent},
  {path: 'create-order', component: ViewOrderComponent},
  {path: 'employee', component: EmployeeComponent},
  {path: 'admin', component: BoardAdminComponent},
  {path: 'vendor', component: BoardVendorComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
