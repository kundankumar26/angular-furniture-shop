import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(public router: Router, 
    private tokenStorage: TokenStorageService) { }
  
  //ALLOW ONLY LOGGED OUT USERS AND EMPLOYEE
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if(!this.tokenStorage.getToken()){
      return true;
    }
    const roles = this.tokenStorage.getUser().roles[0];
    //console.log(route.data, roles);
    if(route.data.expectedRole == roles){
      return true;
    } else if(roles == 'ROLE_VENDOR'){
      this.router.navigate(['vendor']);
      return true;
    } else if(roles == 'ROLE_ADMIN'){
      this.router.navigate(['admin']);
      return true;
    } 
    this.router.navigate(['orders']);
    return false;
  }
}
