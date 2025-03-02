import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

// If you need a JwtPayload type, define it here
interface JwtPayload {
  sub?: string;
  exp?: number;
  // Add other JWT claims you need
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private jwtTokenKey = 'jwt';
  private usernameKey = 'username';
  private addressKey = 'address';
  private roleKey = 'role';
  
  // JWT Token
  setToken(token: string): void {
    localStorage.setItem(this.jwtTokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.jwtTokenKey);
  }


  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const decodedToken = jwtDecode<{ userId?: number }>(token);
      return decodedToken.userId ?? null; // Extracts userId
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getUsernameFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const decodedToken = jwtDecode<{ sub?: string }>(token); 
      return decodedToken.sub ?? null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  

  getRoleFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
  
    try {
      const decodedToken = jwtDecode<{ roles?: string[] }>(token);
      return decodedToken.roles ? decodedToken.roles[0] : null; // Get the first role
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  }

  // Username
  setUsername(username: string): void {
    localStorage.setItem(this.usernameKey, username);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.usernameKey);
  }

  // Address
  setAddress(address: any): void {
    localStorage.setItem(this.addressKey, JSON.stringify(address));
  }

  getAddress(): any {
    const address = localStorage.getItem(this.addressKey);
    return address ? JSON.parse(address) : null;
  }

  // Role
  setRole(role: string): void {
    localStorage.setItem(this.roleKey, role);
  }

  getRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  // Clear all auth data
  clearAuthData(): void {
    localStorage.removeItem(this.jwtTokenKey);
    localStorage.removeItem(this.usernameKey);
    localStorage.removeItem(this.addressKey);
    localStorage.removeItem(this.roleKey);
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
} 