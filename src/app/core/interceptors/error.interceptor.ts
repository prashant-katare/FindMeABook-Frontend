import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred';
      
      // Handle different error status codes
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 200:
            errorMessage = 'OK';
            break;
          case 400:
            errorMessage = error.error?.message || 'Bad request';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please log in again.';
            // Clear auth data and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('role');
            router.navigate(['/login']);
            break;
          case 403:
            errorMessage = 'You do not have permission to access this resource';
            break;
          case 404:
            errorMessage = 'Resource not found';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = `Error ${error.status}: ${error.error?.message || error.statusText}`;
        }
      }
      
      // Log error for debugging
      console.error('HTTP Error:', errorMessage, error);
      
      // Return the error with the message for any subscribers to handle
      return throwError(() => ({
        error: error.error,
        status: error.status,
        message: errorMessage
      }));
    })
  );

}; 