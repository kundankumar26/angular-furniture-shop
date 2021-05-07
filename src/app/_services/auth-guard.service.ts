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
    this.router.navigate(['home']);
    return false;
  }
}
