import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  genreTag: string;
  price: number;
  isWishlisted: boolean;
  isInCart: boolean;
  imageUrl: string;
  rating: number;
  stockQuantity: number;
  genreId: number;
  quantitiesInCart: number;
}

export interface BookSection {
  genre: string;
  books: Book[];
}

export interface CartItemDTO {
  bookId: number;
  title: string;
  author: string;
  imageUrl: string;
  price: number;
  quantity: number;
  addedDate: string;
}

export interface WishlistItemDTO {
  bookId: number;
  title: string;
  author: string;
  imageUrl: string;
  price: number;
  addedDate: string;
  isInCart: boolean;
  inStock: boolean;
}

export interface Order {
  id: string;
  userId: string;
  username: string;
  createdAt: Date;
  totalPrice: number;
  status: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  bookId: number;
  bookTitle: string;
  quantity: number;
  price: number;
  orderId: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:8011/book';

  constructor(private http: HttpClient) {}

  getAllBooks(): Observable<BookSection[]> {
    return this.http.get<BookSection[]>(`${this.apiUrl}/allBooks`).pipe(
      catchError((error) => {
        console.error('Error fetching books:', error);
        return throwError(() => new Error('Failed to fetch books. Please try again later.'));
      })
    );
  }

  getCartItems(username: string): Observable<CartItemDTO[]> {
    const token = localStorage.getItem('jwt');
    return this.http.get<CartItemDTO[]>(`${this.apiUrl}/user/${username}/cart`, {
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

  getFavoriteItems(username: string): Observable<WishlistItemDTO[]> {
    const token = localStorage.getItem('jwt');
    return this.http.get<WishlistItemDTO[]>(`${this.apiUrl}/user/${username}/wishlist`, {
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

  removeFromFavorites(username: string, bookId: number): Observable<void> {
    const token = localStorage.getItem('jwt');
    return this.http.delete<void>(`${this.apiUrl}/user/${username}/wishlist/${bookId}`, {
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

  addToFavorites(username: string, bookId: number): Observable<any> {
    if (!username) {
      return throwError(() => new Error('User must be logged in to add favorites'));
    }
    
    const token = localStorage.getItem('jwt');
    return this.http.post(`${this.apiUrl}/user/${username}/wishlist/${bookId}`, {}, {
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

  addToCart(username: string, bookId: number): Observable<any> {
    if (!username) {
      return throwError(() => new Error('User must be logged in to add to cart'));
    }
    
    const token = localStorage.getItem('jwt');
    return this.http.post(`${this.apiUrl}/user/${username}/cart/${bookId}`, {}, {
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

  removeFromCart(username: string, bookId: number): Observable<void> {
    const token = localStorage.getItem('jwt');
    return this.http.delete<void>(`${this.apiUrl}/user/${username}/cart/${bookId}`, {
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

  updateCartItemQuantity(username: string, bookId: number, quantity: number): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.put(`${this.apiUrl}/user/${username}/cart/${bookId}?quantity=${quantity}`, {}, {
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

  searchBooks(query: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/search?query=${query}`);
  }

  getBookById(bookId: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${bookId}`).pipe(
      catchError((error) => {
        console.error('Error fetching book details:', error);
        return throwError(() => new Error('Failed to fetch book details. Please try again later.'));
      })
    );
  }

  clearCart(username: string): Observable<any> {
    const token = localStorage.getItem('jwt');
    return this.http.delete<any>(`${this.apiUrl}/remove-all/${username}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }),
      responseType: 'text' as 'json' 
    }).pipe(
      catchError((error) => {
        console.error('Error clearing cart:', error);
        return throwError(() => new Error('Failed to clear cart. Please try again later.'));
      })
    );
  }

  placeOrder(username: string): Observable<Order> {
    const url = `${this.apiUrl}/user/${username}/order/place`;
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Order>(url, {}, { headers }).pipe(
      catchError((error) => {
        console.error('Error placing order:', error);
        return throwError(() => new Error('Failed to place order. Please try again later.'));
      })
    );
  }

  getOrders(username: string): Observable<Order[]> {
    const url = `${this.apiUrl}/user/${username}/order/get`;
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Order[]>(url, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching orders:', error);
        return throwError(() => new Error('Failed to fetch orders. Please try again later.'));
      })
    );
  }

  getAllOrders(): Observable<Order[]> {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Order[]>(`${this.apiUrl}/admin/orders`, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching all orders:', error);
        return throwError(() => new Error('Failed to fetch orders. Please try again later.'));
      })
    );
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put(
      `${this.apiUrl}/admin/orders/${orderId}/status`, 
      { status }, 
      { headers }
    ).pipe(
      catchError((error) => {
        console.error('Error updating order status:', error);
        return throwError(() => new Error('Failed to update order status. Please try again later.'));
      })
    );
  }

  getAllUserOrders(): Observable<Order[]> {
    const token = localStorage.getItem('jwt');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Order[]>(`${this.apiUrl}/user/orders`, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching all user orders:', error);
        return throwError(() => new Error('Failed to fetch user orders. Please try again later.'));
      })
    );
  }
} 