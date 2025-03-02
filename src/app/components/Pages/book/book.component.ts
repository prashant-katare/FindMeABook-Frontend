import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { CartService } from '../../../core/services/cart.service';
import { Book } from '../../../core/models/book.model';
import { StorageService } from '../../../core/services/storage.service';


@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  book!: Book;
  loading = true;
  error: string | null = null;
  wishlistedBooks: number[] = [];
  cartBooks: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router,
    public authService: AuthService,
    private wishlistService: WishlistService,
    private cartService: CartService,
    private storageService: StorageService
  ) {}

  async ngOnInit() {
    await this.loadUserData();
    this.loadBookDetails();
  }

  async loadUserData() {

    if (!this.storageService.isLoggedIn() && !this.authService.hasUserRole()) {
      
      const userId = this.storageService.getUserIdFromToken();
      if (userId) {
        // Load wishlisted books
        this.wishlistService.getFavoriteItems(userId).subscribe({
          next: (favorites) => {
            this.wishlistedBooks = favorites.map(book => book.bookId);
          },
          error: (error) => console.error('Error loading favorites:', error)
        });

        // Load cart books
        this.cartService.getCartItems(userId).subscribe({
          next: (cartItems) => {
            this.cartBooks = cartItems.map(book => book.bookId);
          },
          error: (error) => console.error('Error loading cart:', error)
        });
      }

    }
  }

  private loadBookDetails(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const bookId = Number(params.get('id'));
        return this.bookService.getBookById(bookId);
      })
    ).subscribe({
      next: (book) => {
        this.book = book;
        this.loading = false;

        this.book.isInCart = this.cartBooks.includes(this.book.id);
        this.book.isWishlisted = this.wishlistedBooks.includes(this.book.id);
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  addToCart(): void {

    if (!this.storageService.isLoggedIn() && !this.authService.hasUserRole()) {
      
      if (this.book.stockQuantity > 0) {
        const userId = this.storageService.getUserIdFromToken();
        if (userId) {
          this.cartService.addToCart(userId, this.book.id).subscribe({
            next: () => {
            this.book.isInCart = true;
            console.log(`Book "${this.book.title}" added to cart`);
          },
          error: (error: any) => {
            console.error('Error adding to cart:', error);
          }
        });
      }
    }
  }
  }

  addToWishlist(): void {

    if (!this.storageService.isLoggedIn() && !this.authService.hasUserRole()) {

      const userId = this.storageService.getUserIdFromToken();
      if (userId) {
        this.wishlistService.addToFavorites(userId, this.book.id).subscribe({
          next: () => {
            this.book.isWishlisted = true;
            console.log(`Book "${this.book.title}" added to wishlist`);
        },
        error: (error: any) => {
            console.error('Error adding to wishlist:', error);
          }
        });
      }
    }
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
} 