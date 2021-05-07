import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignupRequestPayload } from '../register/register-request.payload';
import { TokenStorageService } from './token-storage.service';
import { Product } from '../models/product';

const AUTH_API = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    
  constructor(private httpClient: HttpClient, private tokenStorage: TokenStorageService) { }

  signup(payload: SignupRequestPayload): Observable<any> {
    return this.httpClient.post(AUTH_API + "signup/", payload, { responseType: 'json' });
  }

  signin(payload: any): Observable<any> {
    return this.httpClient.post(AUTH_API + 'signin/', payload, {responseType: 'json'});
  }


  //Methods for Employee only
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
        'Authorization': "Bearer " + this.tokenStorage.getToken(),
      })
    };
    return this.httpClient.post(AUTH_API + 'employee/', payload, httpOptions);
  }


  //Methods for Vendor only
  getOrdersForVendor(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + window.sessionStorage.getItem('auth-token'),
      })
    };
    return this.httpClient.get(AUTH_API + 'vendor/', httpOptions);
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

  createProductByVendor(body: any): Observable<any> {
    const userId = this.tokenStorage.getUser().id;
    console.log(userId);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + window.sessionStorage.getItem('auth-token'),
      })
    };
    return this.httpClient.post(AUTH_API + 'products/' + userId, body, httpOptions);
  }

  //Methods for Admin only
  getOrdersForAdmin(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + window.sessionStorage.getItem('auth-token'),
      })
    };
    return this.httpClient.get(AUTH_API + 'admin/', httpOptions);
  }

  getOldOrdersForAdmin(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + window.sessionStorage.getItem('auth-token'),
      })
    };
    return this.httpClient.get(AUTH_API + 'admin/view-all/', httpOptions);
  }

  acceptOrderByAdmin(orderId: number, qty: number, productId: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + window.sessionStorage.getItem('auth-token'),
      })
    };
    return this.httpClient.patch(AUTH_API + 'admin/' + orderId, {"qty": qty, "isRejectedByAdmin": 1, "productId": productId}, httpOptions);
  }

  rejectOrderByAdmin(orderId: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + window.sessionStorage.getItem('auth-token'),
      })
    };
    return this.httpClient.patch(AUTH_API + 'admin/' + orderId, {"isRejectedByAdmin": 2}, httpOptions);
  }


  //Methods for products
  getAllProducts(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.tokenStorage.getToken(),
      })
    };
    return this.httpClient.get(AUTH_API + 'products/', httpOptions);
  }
}
