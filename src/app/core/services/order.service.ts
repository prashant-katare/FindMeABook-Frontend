import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Order } from '../models/order.model';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/${environment.order}`;

  constructor(private http: HttpClient, private storageService: StorageService) {}

  placeOrder(userId: number): Observable<Order> {
    const url = `${this.apiUrl}/${userId}/place`;
    const token = this.storageService.getToken();
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

  getAllOrders(): Observable<Order[]> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Order[]>(`${this.apiUrl}/admin/all`, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching all orders:', error);
        return throwError(() => new Error('Failed to fetch orders. Please try again later.'));
      })
    );
  }

  updateOrderStatus(orderId: string, status: string): Observable<any> {
    const token = this.storageService.getToken();
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

  getAllUserOrders(userId: number): Observable<Order[]> {
    const token = this.storageService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Order[]>(`${this.apiUrl}/${userId}/getUserOrders`, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching all user orders:', error);
        return throwError(() => new Error('Failed to fetch user orders. Please try again later.'));
      })
    );
  }

  
} 