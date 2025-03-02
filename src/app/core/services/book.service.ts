import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Book } from '../models/book.model';
import { BookSection } from '../models/book.model';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = `${environment.apiUrl}/${environment.book}`;

  constructor(private http: HttpClient) {}

  getAllBooks(): Observable<BookSection[]> {
    return this.http.get<BookSection[]>(`${this.apiUrl}/allBooks`).pipe(
      catchError((error) => {
        console.error('Error fetching books:', error);
        return throwError(() => new Error('Failed to fetch books. Please try again later.'));
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


}
