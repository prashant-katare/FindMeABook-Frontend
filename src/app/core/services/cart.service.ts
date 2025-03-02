import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { CartItemDTO } from '../models/cart.model';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  private apiUrl = `${environment.apiUrl}/${environment.cart}`;

  getCartItems(userId: number): Observable<CartItemDTO[]> {
    const token = localStorage.getItem('jwt');
    return this.http.get<CartItemDTO[]>(`${this.apiUrl}/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError((error) => {
        console.error('Error fetching cart items:', error);
        return throwError(() => new Error('Failed to fetch cart items. Please try again later.'));
      })
    );
  }

  
  addToCart(userId: number, bookId: number): Observable<any> {
    if (!userId) {
      return throwError(() => new Error('User must be logged in to add to cart'));
    }
    const quantity = 1;
    const token = localStorage.getItem('jwt');
    return this.http.post(`${this.apiUrl}/${userId}/add?bookId=${bookId}&quantity=${quantity}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError((error) => {
        console.error('Error adding to cart:', error);
        return throwError(() => new Error('Failed to add to cart. Please try again later.'));
      })
    );
  }

  removeFromCart(userId: number, bookId: number): Observable<void> {
    const token = localStorage.getItem('jwt');
    return this.http.delete<void>(`${this.apiUrl}/${userId}/remove?bookId=${bookId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError((error) => {
        console.error('Error removing from cart:', error);
        return throwError(() => new Error('Failed to remove from cart. Please try again later.'));
      })
    );
  }

  updateCartItemQuantity(userId: number, bookId: number, quantity: number): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.put(`${this.apiUrl}/${userId}/update?bookId=${bookId}&quantity=${quantity}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError((error) => {
        console.error('Error updating cart quantity:', error);
        return throwError(() => new Error('Failed to update cart quantity. Please try again later.'));
      })
    );
  }

  clearCart(userId: number): Observable<void> {
    const token = localStorage.getItem('jwt');
    return this.http.delete<void>(`${this.apiUrl}/${userId}/clear`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(  
      catchError((error) => {       
        console.error('Error clearing cart:', error);
        return throwError(() => new Error('Failed to clear cart. Please try again later.'));
      })
    );
  }
} 