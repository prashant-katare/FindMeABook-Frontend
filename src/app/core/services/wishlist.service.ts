import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { WishlistItemDTO } from '../models/wishlist.model';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItemsSubject = new BehaviorSubject<any[]>([]);
  public wishlistItems$ = this.wishlistItemsSubject.asObservable();
  private apiUrl = `${environment.apiUrl}/${environment.wishlist}`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getFavoriteItems(userId: number): Observable<WishlistItemDTO[]> {
    const token = localStorage.getItem('jwt');
    return this.http.get<WishlistItemDTO[]>(`${this.apiUrl}/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError((error) => {
        console.error('Error fetching favorite items:', error);
        return throwError(() => new Error('Failed to fetch favorite items. Please try again later.'));
      })
    );
  }

  removeFromFavorites(userId: number, bookId: number): Observable<void> {
    const token = localStorage.getItem('jwt');
    return this.http.delete<void>(`${this.apiUrl}/${userId}/remove?bookId=${bookId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError((error) => {
        console.error('Error removing from favorites:', error);
        return throwError(() => new Error('Failed to remove from favorites. Please try again later.'));
      })
    );
  }

  addToFavorites(userId: number, bookId: number): Observable<any> {
    if (!userId) {
      return throwError(() => new Error('User must be logged in to add favorites'));
    }
    
    const token = localStorage.getItem('jwt');
    return this.http.post(`${this.apiUrl}/${userId}/add?bookId=${bookId}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError((error) => {
        console.error('Error adding to favorites:', error);
        return throwError(() => new Error('Failed to add to favorites. Please try again later.'));
      })
    );
  }

  moveToCart(userId: number, bookId: number): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.post(`${this.apiUrl}/${userId}/move-to-cart?bookId=${bookId}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).pipe(
      catchError((error) => {
        console.error('Error moving to cart:', error);
        return throwError(() => new Error('Failed to move to cart. Please try again later.'));
      })
    );
  } 

} 