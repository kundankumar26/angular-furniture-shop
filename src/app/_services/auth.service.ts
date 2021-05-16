import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';
import { Order } from '../models/order';

const AUTH_API = 'https://perpendicular-shop.herokuapp.com/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    
  constructor(private httpClient: HttpClient, private tokenStorage: TokenStorageService) { }

  signup(payload: any): Observable<any> {
    return this.httpClient.post(AUTH_API + "signup/", payload, { responseType: 'json' });
  }

  signin(payload: any): Observable<any> {
    return this.httpClient.post(AUTH_API + 'signin/', payload, {responseType: 'json'});
  }


  //Methods for Employee only
  getOrdersForEmployee(): Observable<any>{
    return this.httpClient.get(AUTH_API + 'employee/', this.getHeaders());
  }

  createOrderForEmployee(payload: any): Observable<any>{
    return this.httpClient.post(AUTH_API + 'employee/', payload, this.getHeaders());
  }


  //Methods for Vendor only
  getOrdersForVendor(): Observable<any> {
    return this.httpClient.get(AUTH_API + 'vendor/', this.getHeaders());
  }

  updateOrderByVendor(orderId: number, payload: Order): Observable<any> {
    return this.httpClient.patch(AUTH_API + 'vendor/' + orderId, payload, this.getHeaders());
  }

  createProductByVendor(body: any): Observable<any> {
    const userId = this.tokenStorage.getUser().id;
    return this.httpClient.post(AUTH_API + 'products/', body, this.getHeaders());
  }

  //Methods for Admin only
  getOrdersForAdmin(): Observable<any> {
    return this.httpClient.get(AUTH_API + 'admin/', this.getHeaders());
  }

  getOldOrdersForAdmin(): Observable<any> {
    return this.httpClient.get(AUTH_API + 'admin/view-all/', this.getHeaders());
  }

  acceptOrderByAdmin(orderId: number, qty: number, productId: number): Observable<any> {
    return this.httpClient.patch(AUTH_API + 'admin/' + orderId, {"qty": qty, "isRejectedByAdmin": 1, "productId": productId}, this.getHeaders());
  }

  rejectOrderByAdmin(orderId: number): Observable<any> {
    return this.httpClient.patch(AUTH_API + 'admin/' + orderId, {"isRejectedByAdmin": 2}, this.getHeaders());
  }


  //Methods for products
  getAllProducts(): Observable<any> {
    return this.httpClient.get(AUTH_API + 'products/', this.getHeaders());
  }

  
  //Methods for token confirmation
  sendConfirmationToken(confirmationToken: string): Observable<any> {
    return this.httpClient.get(AUTH_API + 'confirm-account?token=' + confirmationToken,
      { headers: new HttpHeaders({ 'content-Type': 'application/json' }) });
  }


  //Methods related to cart
  getProductsFromCart(): Observable<any> {
    return this.httpClient.get(AUTH_API + 'cart/', this.getHeaders());
  }

  addProductToCart(productId: number): Observable<any> {
    return this.httpClient.post(AUTH_API + 'cart/', {"productId": productId}, this.getHeaders());
  }

  deleteFromCart(cartId: number): Observable<any> {
    return this.httpClient.delete(AUTH_API + 'cart/' + cartId + '/', this.getHeaders());
  }


  //Methods related to wishlist
  getProductsFromWishlist(): Observable<any> {
    return this.httpClient.get(AUTH_API + 'wishlist/', this.getHeaders());
  }

  addProductToWishlist(productId: number): Observable<any> {
    return this.httpClient.post(AUTH_API + 'wishlist/', {"productId": productId}, this.getHeaders());
  }

  removeFromWishlist(wishlistId: number): Observable<any> {
    return this.httpClient.delete(AUTH_API + 'wishlist/' + wishlistId + '/', this.getHeaders());
  }


  //Methods related to comments
  getCommentsForProduct(productId: number): Observable<any> {
    
    return this.httpClient.get(AUTH_API + 'products/' + productId + '/', this.getHeaders());
  }

  getCommentByUser(productId: number): Observable<any> {
    return this.httpClient.get(AUTH_API + 'products/' + productId + '/comments/', this.getHeaders());
  }

  addCommentToProduct(productId: number, commentPayload: any): Observable<any> {
    return this.httpClient.post(AUTH_API + 'products/' + productId + '/', commentPayload, this.getHeaders());
  }

  updateCommentForProduct(commentPayload: any): Observable<any> {
    return this.httpClient.patch(AUTH_API + 'products/' + commentPayload.productId + '/' + commentPayload.commentId + '/', 
      commentPayload, this.getHeaders());
  }

  private getHeaders(): any {
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + this.tokenStorage.getToken(),
      })
    };
    return httpOptions;
  }
}
