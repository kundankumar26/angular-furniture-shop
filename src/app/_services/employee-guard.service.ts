import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeGuardService {

  constructor(private router: Router, private tokenStorage: TokenStorageService) { }

  //Allow only logged in users with EMPLOYEE role
  canActivate(): boolean {
    if(!this.tokenStorage.getToken()){
      this.router.navigate(['login']);
      return false;
    }
    const roles = this.tokenStorage.getUser().roles[0];
    if(roles == 'ROLE_EMPLOYEE'){
      return true;
    }
    this.router.navigate(['home']);
    return false;
  }
}
