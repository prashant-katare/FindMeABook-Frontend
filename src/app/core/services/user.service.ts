import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError } from 'rxjs';
import { Observable, throwError } from 'rxjs';
import { UserProfile } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private apiUrl = `${environment.apiUrl}/${environment.auth}`;

  constructor(private http: HttpClient, private storageService: StorageService) { }


  getToken(): string | null {
    return localStorage.getItem('token');
  }

  handleError(error: any, message: string): Observable<never> {
    console.error(error);
    return throwError(() => new Error(message));
  }     


} 