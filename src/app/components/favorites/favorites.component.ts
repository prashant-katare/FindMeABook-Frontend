import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookService, WishlistItemDTO } from '../../services/book.service';

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
    private router: Router
  ) {
  }

  async ngOnInit() {
    await this.loadUserData();
    this.loadFavoriteItems();
  }

  async loadUserData() {
    const username = localStorage.getItem('username');
    if (username) {
      // Load cart books
      this.bookService.getCartItems(username).subscribe({
        next: (cartItems) => {
          this.cartBooks = cartItems.map(book => book.bookId);
        },
        error: (error) => console.error('Error loading cart:', error)
      });
    }
  }

  loadFavoriteItems(): void {
    this.bookService.getFavoriteItems(this.username).subscribe({
      next: (books) => {
        this.favoriteItems = books;
        // Update isInCart flags based on arrays
        this.favoriteItems.forEach(item => {
          item.isInCart = this.cartBooks.includes(item.bookId);
          this.checkInStock(item);
        });
      },
      error: (error) => {
        console.error('Error fetching favorite items:', error);
        // Handle error appropriately
      }
    });
  }

  removeFromFavorites(book: WishlistItemDTO): void {
    this.bookService.removeFromFavorites(this.username, book.bookId).subscribe({
      next: () => {
        this.loadFavoriteItems(); // Reload the favorites after removal
      },
      error: (error) => {
        console.error('Error removing from favorites:', error);
        // Handle error appropriately
      }
    });
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
    const username = localStorage.getItem('username') || '';
    if (!username) return;
    
    this.bookService.addToCart(username, book.bookId).subscribe({
      next: () => {
        //code to remove book from favorites
        this.removeFromFavorites(book);
        //redirect to cart page
        this.router.navigate(['/cart']);
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
      }
    });
    }
} 