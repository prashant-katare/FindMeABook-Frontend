import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WishlistItemDTO } from '../../../core/models/wishlist.model';
import { BookService } from '../../../core/services/book.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favoriteItems: WishlistItemDTO[] = [];
  username: string = localStorage.getItem('username') || '';
  isAddingToCart: { [key: number]: boolean } = {};
  cartBooks: number[] = [];
  inStock: boolean = true;

  constructor(
    private bookService: BookService,
    private router: Router,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private storageService: StorageService
  ) {
  }

  async ngOnInit() {
    await this.loadUserData();
    this.loadFavoriteItems();
  }

  async loadUserData() {
    const userId = this.storageService.getUserIdFromToken();
    if (userId) {
      // Load cart books
      this.cartService.getCartItems(userId).subscribe({
        next: (cartItems) => {
          this.cartBooks = cartItems.map(book => book.bookId);
        },
        error: (error) => console.error('Error loading cart:', error)
      });
    }
  }

  loadFavoriteItems(): void {
    const userId = this.storageService.getUserIdFromToken();
    if (userId) {
      this.wishlistService.getFavoriteItems(userId).subscribe({
        next: (books: WishlistItemDTO[]) => {
          this.favoriteItems = books;
          // Update isInCart flags based on arrays
          this.favoriteItems.forEach(item => {
          item.isInCart = this.cartBooks.includes(item.bookId);
          this.checkInStock(item);
        });
      },
      error: (error: any) => {
        console.error('Error fetching favorite items:', error);
        // Handle error appropriately
      }
    });
    }
  }

  removeFromFavorites(book: WishlistItemDTO): void {
    const userId = this.storageService.getUserIdFromToken();
    if (userId) {
      this.wishlistService.removeFromFavorites(userId, book.bookId).subscribe({
        next: () => {
          this.loadFavoriteItems(); // Reload the favorites after removal
      },
      error: (error: any) => {
        console.error('Error removing from favorites:', error);
        // Handle error appropriately
      }
      });
    }
  }

  checkInStock(wishlistItem: WishlistItemDTO): void {
    this.bookService.getBookById(wishlistItem.bookId).subscribe({
      next: (book) => {
        wishlistItem.inStock = book.stockQuantity > 0;
      },
      error: (error) => {
        console.error('Error fetching book:', error);
      }
    });
  }

  addToCart(book: WishlistItemDTO): void {
    const userId = this.storageService.getUserIdFromToken();
    if (userId) {
      this.cartService.addToCart(userId, book.bookId).subscribe({
      next: () => {
        //code to remove book from favorites
        this.removeFromFavorites(book);
        //redirect to cart page
        this.router.navigate(['/cart']);
      },
      error: (error: any) => {
        console.error('Error adding to cart:', error);
      }
    });
    }
  }
} 