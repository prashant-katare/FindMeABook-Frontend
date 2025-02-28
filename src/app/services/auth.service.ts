import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface SignUpData {
  fullName: string;
  email: string;
  password: string;
}

export interface JwtResponse {
  jwtToken: string;
  username: string;
}

export interface UserProfile {
  username: string;
  fullName: string;
  email: string;
  cartItemsCount: number;
  wishlistItemsCount: number;
}

export interface Address {
  id: number;
  username: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phoneNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8011/auth';

  constructor(private http: HttpClient) {}

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
    ).pipe(
      catchError(error => this.handleError(error, 'Failed to sign up'))
    );
  }

  login(loginData: { email: string; password: string }): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/login`, loginData).pipe(
      tap((response: JwtResponse) => {
        if (response.jwtToken) {
          localStorage.setItem('jwt', response.jwtToken);
          localStorage.setItem('username', response.username);

          if(this.hasUserRole()) {
            this.getUserAddress(response.username).subscribe((address) => {
              localStorage.setItem('address', JSON.stringify(address));
            });
          } 
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    localStorage.removeItem('address');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getUserProfile(username: string): Observable<UserProfile> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }
    console.log(username);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    
    return this.http.get<UserProfile>(`${this.apiUrl}/user/${username}/profile`, { headers }).pipe(
      catchError(error => this.handleError(error, 'Failed to fetch user profile'))
    );
  }

  changePassword(passwords: { currentPassword: string, newPassword: string }): Observable<void> {
    const username = this.getUsername();
    if (!username) {
      return throwError(() => new Error('User not found'));
    }

    const url = `${this.apiUrl}/user/${username}/password`;
    return this.http.put<void>(url, passwords, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      })
    }).pipe(
      catchError((error) => {
        if (error.status === 400) {
          return throwError(() => new Error('Current password is incorrect'));
        }
        return this.handleError(error);
      })
    );
  }

  getUserAddress(username: string): Observable<Address> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Address>(`${this.apiUrl}/user/${username}/address`, { headers }).pipe(
      catchError(error => this.handleError(error, 'Failed to fetch user address'))
    );
  }

  saveOrUpdateAddress(username: string, address: Address): Observable<Address> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Address>(
      `${this.apiUrl}/user/${username}/address`, 
      address, 
      { headers }
    ).pipe(
      catchError(error => this.handleError(error, 'Failed to save or update address'))
    );
  }

  updateUserInfo(username: string, profileData: { fullName: string, email: string }): Observable<UserProfile> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<UserProfile>(
      `${this.apiUrl}/user/${username}/profile`, 
      profileData, 
      { headers }
    ).pipe(
      catchError(error => this.handleError(error, 'Failed to update user profile'))
    );
  }

  hasUserRole(): boolean {
    const token = this.getToken();
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
    const token = this.getToken();
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

  private handleError(error: HttpErrorResponse, customMessage?: string) {
    let errorMessage = customMessage || 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `${errorMessage}: ${error.error.message}`;
    } else if (error.status === 200 && error.statusText === 'OK') {
      // Successful response but parsing failed
      return throwError(() => new Error('Invalid response format from server'));
    } else if (error.status === 401) {
      // Unauthorized
      return throwError(() => new Error('Authentication failed. Please log in again.'));
    } else if (error.status === 403) {
      // Forbidden
      return throwError(() => new Error('You do not have permission to access this resource.'));
    } else if (error.status === 404) {
      // Not found
      return throwError(() => new Error('The requested resource was not found.'));
    } else if (error.status >= 500) {
      // Server errors
      return throwError(() => new Error('Server error. Please try again later.'));
    } else {
      // Other server-side errors
      const serverMessage = error.error?.message || error.message;
      errorMessage = `${errorMessage}: ${serverMessage} (Status: ${error.status})`;
    }
    
    console.error('API Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}