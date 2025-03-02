import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Address } from '../models/address.model';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import { UserProfile } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private apiUrl = `${environment.apiUrl}/${environment.profile}`;

  constructor(private http: HttpClient, private storageService: StorageService) {}

  getUserAddress(userId: number): Observable<Address> {
    const token = this.storageService.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Address>(`${this.apiUrl}/${userId}/getUserAddress`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching user address:', error);
        return throwError(() => new Error('Failed to fetch user address. Please try again later.'));
      })
    );
  }

  saveOrUpdateAddress(userId: number, address: Address): Observable<Address> {
    const token = this.storageService.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Address>(
      `${this.apiUrl}/${userId}/saveOrUpdateAddress`, 
      address, 
      { headers }
    ).pipe(
      catchError(error => {
        console.error('Error saving or updating address:', error);
        return throwError(() => new Error('Failed to save or update address. Please try again later.'));
      })
    );
  }

  getUserProfile(userId: number): Observable<UserProfile> {
    const token = this.storageService.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}`, { headers });
  }

  updateUserInfo(userId: number, profileData: { fullName: string, email: string }): Observable<UserProfile> {
    const token = this.storageService.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<UserProfile>(
      `${this.apiUrl}/${userId}/update`,
      profileData,
      { headers }
    ).pipe(
      catchError(error => throwError(() => new Error('Failed to update user profile')))
    );
  }

  changePassword(passwords: { currentPassword: string, newPassword: string }): Observable<void> {
    const userId = this.storageService.getUserIdFromToken();
    if (!userId) {
      return throwError(() => new Error('User not found'));
    }

    const url = `${this.apiUrl}/${userId}/updatePassword`;
    return this.http.put<void>(url, passwords, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.storageService.getToken()}`
      })
    }).pipe(
      catchError((error) => {
        if (error.status === 400) {
          return throwError(() => new Error('Current password is incorrect'));
        }
        return throwError(() => new Error('Failed to change password'));
      })
    );
  }

} 