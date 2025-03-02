import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { BookService   } from '../../core/services/book.service';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Book } from '../../core/models/book.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  books: Book[] = [];
  loading: boolean = true;
  error: string | null = null;
  showAddBookForm: boolean = false;
  newBook: Book = {} as Book;
  editedBook: Book = {} as Book;      
  
  
  constructor(
    private bookService: BookService,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check if user has admin role
    if (!this.authService.hasAdminRole()) {
      this.router.navigate(['/']);
      return;
    }
    
    this.loadBooks();
  }

  loadBooks(): void {
    this.bookService.getAllBooks().subscribe({
      next: (bookSections) => {
        // Flatten the book sections into a single array of books
        this.books = bookSections.flatMap(section => section.books);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load books';
        this.loading = false;
        console.error('Error loading books:', error);
      }
    });
  }

  updateStock(book: Book): void {
    // This would call a service method to update the book stock
    console.log(`Updating stock for book: ${book.title}`);
    // Implement the actual API call to update stock
  }

  deleteBook(book: Book): void {
    // This would call a service method to delete the book
    console.log(`Deleting book: ${book.title}`);
    // Implement the actual API call to delete a book
  }

  addNewBook(): void {
    // Toggle the form visibility
    this.showAddBookForm = !this.showAddBookForm;
    
    // Reset the newBook object if we're opening the form
    if (this.showAddBookForm) {
      this.newBook = {} as Book;
    }
  }
  

  submitNewBook(): void {
    // Implement the actual API call to save the new book
    console.log('Saving new book:', this.newBook);
    this.showAddBookForm = false;
  }

  cancelAddBook(): void { 
    this.showAddBookForm = false;  
  }

  toggleEditBook(book: Book): void {
    // If we're already editing this book, cancel the edit
    if (this.editedBook.id === book.id) {
      this.editedBook = {} as Book;
    } else {
      // Otherwise, start editing this book
      this.editedBook = { ...book };
    }
  } 

  saveEditedBook(book: Book): void {
    // Implement the actual API call to save the edited book
    console.log('Saving edited book:', book);
    this.editedBook = {} as Book;
  }       

  cancelEditBook(book: Book): void {
    this.editedBook = {} as Book;
  }

  

} 