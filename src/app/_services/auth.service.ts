import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignupRequestPayload } from '../register/register-request.payload';
import { LocalStorageService } from 'ngx-webstorage';

const AUTH_API = 'http://localhost:8080/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) { }

  signup(payload: SignupRequestPayload): Observable<any> {
    return this.httpClient.post(AUTH_API + "signup", payload, { responseType: 'json' });
  }

}
