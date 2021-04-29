import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignupRequestPayload } from '../register/register-request.payload';
import { LocalStorageService } from 'ngx-webstorage';
import { User } from '../models/user';

const AUTH_API = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private httpClient: HttpClient) { }

  signup(payload: SignupRequestPayload): Observable<any> {
    return this.httpClient.post(AUTH_API + "signup/", payload, { responseType: 'json' });
  }

  signin(payload: any): Observable<any> {
    return this.httpClient.post(AUTH_API + 'signin/', payload, {responseType: 'json'});
  }

  getOrdersForEmployee(): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + window.sessionStorage.getItem('auth-token'),
      })
    };
    return this.httpClient.get(AUTH_API + 'employee/', httpOptions);
  }

  createOrderForEmployee(payload: any): Observable<any>{
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + window.sessionStorage.getItem('auth-token'),
      })
    };
    return this.httpClient.post(AUTH_API + 'employee/', payload, httpOptions);
  }

  getOrdersForVendor(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + window.sessionStorage.getItem('auth-token'),
      })
    };
    return this.httpClient.get(AUTH_API + 'vendor/', httpOptions);
  }

  getOrdersForAdmin(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + window.sessionStorage.getItem('auth-token'),
      })
    };
    return this.httpClient.get(AUTH_API + 'admin/', httpOptions);
  }

  acceptOrderByAdmin(orderId: number, qty: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + window.sessionStorage.getItem('auth-token'),
      })
    };
    return this.httpClient.patch(AUTH_API + 'admin/' + orderId, {"qty": qty, "isRejectedByAdmin": 1}, httpOptions);
  }

  rejectOrderByAdmin(orderId: number, qty: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + window.sessionStorage.getItem('auth-token'),
      })
    };
    return this.httpClient.patch(AUTH_API + 'admin/' + orderId, {"qty": qty, "isRejectedByAdmin": 2}, httpOptions);
  }

  updateOrderByVendor(orderId: number, date: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + window.sessionStorage.getItem('auth-token'),
      })
    };
    return this.httpClient.patch(AUTH_API + 'vendor/' + orderId, {"shippedDate": date}, httpOptions);
  }
}
