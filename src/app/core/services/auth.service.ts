import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { JwtResponse } from '../models/auth.model';
import { environment } from '../../../environments/environment';
import { SignUpData } from '../models/auth.model';
import { AddressService } from './address.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/${environment.auth}`;

  constructor(private http: HttpClient, private addressService: AddressService, private storageService: StorageService) {}

  signup(userData: SignUpData): Observable<string> {
    return this.http.post<string>(
      `${this.apiUrl}/signup`, 
      userData,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        responseType: 'text' as 'json'  // Tell HttpClient to expect a text response
      }
    );
  }

  login(loginData: { email: string; password: string }): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/login`, loginData).pipe(
      tap((response: JwtResponse) => {
        if (response.jwtToken) {
          this.storageService.setToken(response.jwtToken);

          // const userId = this.storageService.getUserIdFromToken();
          // console.log(userId);
          // if(userId) {
          //   if(this.hasUserRole()) {
          //     this.addressService.getUserAddress(userId).subscribe((address) => {
          //       this.storageService.setAddress(JSON.stringify(address));
          //     });
          //   } 
          // }
          // else {
          //   console.log('No user ID found');
          //   console.log('Could not set address');
          // }
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('jwt');
  }

  isLoggedIn(): boolean {
    return this.storageService.isLoggedIn();
  }

  hasUserRole(): boolean {
    const token = this.storageService.getToken();
    if (!token) return false;

    try {
      // JWT tokens are in format: header.payload.signature
      const payload = token.split('.')[1];
      // Decode the base64 payload
      const decodedPayload = JSON.parse(atob(payload));
      
      // Check if the roles array includes 'ROLE_USER'
      return decodedPayload.roles && 
             Array.isArray(decodedPayload.roles) && 
             decodedPayload.roles.includes('ROLE_USER');
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return false;
    }
  }

  hasAdminRole(): boolean {
    const token = this.storageService.getToken();
    if (!token) return false;
    
    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      
      return decodedPayload.roles && 
             Array.isArray(decodedPayload.roles) && 
             decodedPayload.roles.includes('ROLE_ADMIN');
    } catch (error) {
      console.error('Error parsing JWT token:', error);
      return false;
    }
  }

  // getUserRoles(): string[] {
  //   const token = this.getToken();
  //   if (!token) return [];
    
  //   try {
  //     const payload = token.split('.')[1];
  //     const decodedPayload = JSON.parse(atob(payload));
      
  //     return decodedPayload.roles && Array.isArray(decodedPayload.roles) 
  //       ? decodedPayload.roles 
  //       : [];
  //   } catch (error) {
  //     console.error('Error parsing JWT token:', error);
  //     return [];
  //   }
  // }
}