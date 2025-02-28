import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookService, CartItemDTO } from '../../services/book.service';
import { Router } from '@angular/router';

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

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.bookService.getCartItems(this.username).subscribe({
      next: (books) => {
        this.cartItems = books;
        console.log(this.cartItems);
      },
      error: (error) => {
        console.error('Error fetching cart items:', error);
        // Handle error appropriately
      }
    });
  }

  decreaseQuantity(book: CartItemDTO): void {
    if (book.quantity > 1) {
      this.bookService.updateCartItemQuantity(this.username, book.bookId, book.quantity - 1).subscribe({
        next: () => {
          this.loadCartItems(); // Reload cart after update
        },
        error: (error) => {
          console.error('Error decreasing quantity:', error);
          // Handle error appropriately
        }
      });
    } else {
      this.removeFromCart(book); // Remove item if quantity would become 0
    }
  }

  increaseQuantity(book: CartItemDTO): void {
    this.bookService.updateCartItemQuantity(this.username, book.bookId, book.quantity + 1).subscribe({
      next: () => {
        this.loadCartItems(); // Reload cart after update
      },
      error: (error) => {
        console.error('Error increasing quantity:', error);
        alert("Not enough stock available");
        // Handle error appropriately
      }
    });
  }

  removeFromCart(book: CartItemDTO): void {
    this.bookService.removeFromCart(this.username, book.bookId).subscribe({
      next: () => {
        this.loadCartItems(); // Reload the cart items after removal
      },
      error: (error) => {
        console.error('Error removing from cart:', error);
        // Handle error appropriately
      }
    });
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