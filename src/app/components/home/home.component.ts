import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService, BookSection, Book } from '../../services/book.service';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  bookSections: BookSection[] = [];
  loading: boolean = true;
  error: string | null = null;
  wishlistedBooks: number[] = [];
  cartBooks: number[] = [];
  searchQuery: string = '';
  books: Book[] = [];
  searchSubject = new Subject<string>();

  constructor(
    private bookService: BookService,
    private router: Router,
    public authService: AuthService
  ) {}

  async ngOnInit() {
    await this.loadUserData();
    this.loadBooks();

    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(query => {
      this.onSearch(query);
    });
  }

  async loadUserData() {
    const username = localStorage.getItem('username');
    if (username) {
      // Load wishlisted books
      if (this.authService.isLoggedIn() && this.authService.hasUserRole()) {
      
      this.bookService.getFavoriteItems(username).subscribe({
        next: (favorites) => {
          this.wishlistedBooks = favorites.map(book => book.bookId);
        },
        error: (error) => console.error('Error loading favorites:', error)
      });

      // Load cart books
      this.bookService.getCartItems(username).subscribe({
        next: (cartItems) => {
          this.cartBooks = cartItems.map(book => book.bookId);
        },
        error: (error) => console.error('Error loading cart:', error)
      });
    }
  }
  }

  loadBooks() {
    this.loading = true;
    this.bookService.getAllBooks().subscribe({
      next: (bookSectionsArray) => {
        this.bookSections = bookSectionsArray;
        this.loading = false;
        
        // Update isInCart and isWishlisted flags based on arrays
        this.bookSections.forEach(section => {
          section.books.forEach(book => {
            book.isInCart = this.cartBooks.includes(book.id);
            book.isWishlisted = this.wishlistedBooks.includes(book.id);
          });
        });
      },
      error: (error) => {
        this.error = 'Failed to load books';
        this.loading = false;
        console.error('Error loading books:', error);
      }
    });
  }

  onSearch(query: string) {
    if (query.trim() !== '') {
      this.bookService.searchBooks(query).subscribe((result) => {
        this.books = result;
      });
    } else {
      this.loadBooks();
    }
  }
  
  updateSearch(query: string) {
    this.searchSubject.next(query);
  }

  toggleWishlist(book: Book): void {
    book.isWishlisted = !book.isWishlisted;
  }

  toggleCart(book: Book): void {
    book.isInCart = !book.isInCart;
  }

  isInStock(book: Book): boolean {
    return book.stockQuantity > 0;
  }

  addToCart(book: Book): void {
    if (book.stockQuantity > 0) {
      const username = localStorage.getItem('username') || '';
      this.bookService.addToCart(username, book.id).subscribe({
        next: () => {
          book.isInCart = true;
          this.cartBooks.push(book.id);
          console.log(`Book "${book.title}" added to cart`);
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
        }
      });
    }
  }

  addToWishlist(book: Book): void {
    const username = localStorage.getItem('username') || '';
    this.bookService.addToFavorites(username, book.id).subscribe({
      next: () => {
        book.isWishlisted = true;
        this.wishlistedBooks.push(book.id);
        console.log(`Book "${book.title}" added to wishlist`);
      },
      error: (error) => {
        console.error('Error adding to wishlist:', error);
      }
    });
  }

  navigateToBookDetails(bookId: string): void {
    this.router.navigate(['/book', bookId]);
  }

} 