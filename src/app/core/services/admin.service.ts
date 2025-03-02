import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, Observable, throwError } from 'rxjs';
import { StorageService } from './storage.service';

interface PasswordUpdateDTO {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/${environment.admin}`;  


  constructor(private http: HttpClient, private storageService: StorageService) { }

  changePassword(passwords: { currentPassword: string, newPassword: string }): Observable<void> {
    const userId = this.storageService.getUserIdFromToken();
    if (!userId) {
      return throwError(() => new Error('User not found'));
    }

    const url = `${this.apiUrl}/${userId}/updatePassword`;
    console.log(url);
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

  // Admin service methods will be added as needed
} 