import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(private tokenStorage: TokenStorageService, public router: Router) { }

  //ALLOW ONLY LOGGED IN USERS WITH A ROLE
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(!this.tokenStorage.getToken()){
      this.router.navigate(['login']);
      return false;
    }
    
    const roles = this.tokenStorage.getUser().roles[0];
    if(roles == 'ROLE_EMPLOYEE'){
      return true;
    } else if(roles == 'ROLE_VENDOR'){
      return true;
    } else if(roles == 'ROLE_ADMIN'){
      return true;
    }
    return false;
  }

  
}
