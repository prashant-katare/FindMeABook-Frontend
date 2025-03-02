import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { CartItemDTO } from '../../../core/models/cart.model';
import { Router } from '@angular/router'; 
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItemDTO[] = [];
  username: string = localStorage.getItem('username') || ''; // Replace this with actual logged-in user

  constructor(private cartService: CartService, private router: Router, private storageService: StorageService) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    const userId = this.storageService.getUserIdFromToken();
      if (userId) {
        this.cartService.getCartItems(userId).subscribe({
          next: (books: CartItemDTO[]) => {
            this.cartItems = books;
            console.log(this.cartItems);
        },
        error: (error: any) => {
          console.error('Error fetching cart items:', error);
          // Handle error appropriately
        }
      });
    }
  }

  decreaseQuantity(book: CartItemDTO): void {
    const userId = this.storageService.getUserIdFromToken();

      if (userId) {
        if (book.quantity > 1) {  
          this.cartService.updateCartItemQuantity(userId, book.bookId, book.quantity - 1).subscribe({
            next: () => {
            this.loadCartItems(); // Reload cart after update
          },
          error: (error: any) => {
            console.error('Error decreasing quantity:', error);
            // Handle error appropriately
          }
        });
      } else {
        this.removeFromCart(book); // Remove item if quantity would become 0
      }
    }
  }

  increaseQuantity(book: CartItemDTO): void {
    const userId = this.storageService.getUserIdFromToken();
      if (userId) {
        this.cartService.updateCartItemQuantity(userId, book.bookId, book.quantity + 1).subscribe({
          next: () => {
            this.loadCartItems(); // Reload cart after update
          },
        error: (error: any) => {
          console.error('Error increasing quantity:', error);
          alert("Not enough stock available");
          // Handle error appropriately
        }
      });
    }
  }

  removeFromCart(book: CartItemDTO): void {
    const userId = this.storageService.getUserIdFromToken();
      if (userId) {
        this.cartService.removeFromCart(userId, book.bookId).subscribe({
          next: () => {
            this.loadCartItems(); // Reload the cart items after removal
        },
        error: (error: any) => {
          console.error('Error removing from cart:', error);
          // Handle error appropriately
        }
      });
    }
  }

  calculateSubtotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }
  
  proceedToBuy(): void {
    // Navigate to checkout page
    //perform check if address is present in local storage
    const address = localStorage.getItem('address');
    if (address) {
      this.router.navigate(['/checkout']);
    } else {
      alert('Please add an address to proceed to checkout');
      this.router.navigate(['/profile']);
    }
  }
} 