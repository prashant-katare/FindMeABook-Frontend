import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookService, CartItemDTO } from '../../services/book.service';
import { AuthService, Address } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItemDTO[] = [];
  checkoutForm: FormGroup;
  loading = false;
  formValid = true;
  address: Address | null = null;
  addressLoading = false;
  error = '';
  orderPlaced = false;
  
  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private authService: AuthService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      paymentMethod: ['creditCard', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardName: ['', [Validators.required, Validators.minLength(3)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });
  }

  ngOnInit(): void {
    this.loadCartItems();
    this.loadUserAddress();
  }

  loadCartItems(): void {
    const username = this.authService.getUsername();
    if (!username) {
      this.error = 'Not authenticated';
      return;
    }

    this.bookService.getCartItems(username).subscribe({
      next: (items) => {
        this.cartItems = items;
      },
      error: (err) => {
        this.error = 'Failed to load cart items: ' + err.message;
      }
    });
  }

  loadUserAddress(): void {
    const username = this.authService.getUsername();
    if (!username) {
      this.error = 'Not authenticated';
      return;
    }

    if (localStorage.getItem('address')) {
        
        this.address = JSON.parse(localStorage.getItem('address') || '{}');
        this.addressLoading = false;
        } else {
            this.addressLoading = true;
            this.authService.getUserAddress(username).subscribe({
            next: (data) => {
                    this.address = data;
                this.addressLoading = false;
                //save address to local storage
                localStorage.setItem('address', JSON.stringify(this.address));
            },
        error: (err) => {
        this.error = 'Failed to load address: ' + err.message;
        this.addressLoading = false;
        }
    });
  }
}

  calculateSubtotal(): number {
    return this.cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  calculateTax(): number {
    return this.calculateSubtotal() * 0.08; // 8% tax
  }

  calculateShipping(): number {
    return this.calculateSubtotal() > 50 ? 0 : 5.99; // Free shipping over $50
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateTax() + this.calculateShipping();
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      this.loading = true;
      this.formValid = true;
      console.log(this.checkoutForm.value);
      
      // Simulate order processing
      setTimeout(() => {
        this.loading = false;
        this.orderPlaced = true;
        
        // First place order, then clear cart after successful order
        const username = this.authService.getUsername();
        if (username) {
          this.bookService.placeOrder(username).subscribe({
            next: (order) => {
              console.log('Order placed successfully:', order);
              // Clear cart only after order is successfully placed
              this.bookService.clearCart(username).subscribe({
                next: () => {
                  console.log('Cart cleared successfully');
                },
                error: (err) => {
                  console.error('Failed to clear cart:', err);
                }
              });
              console.log('Cart cleared successfully');
            },
            error: (err) => {
              console.error('Failed to place order:', err);
            }
          });
          console.log('The delay is response is 2000ms because setTimeout method is used. Ignore message "Form submission canceled because the form is not connected"');
        }
      },2000);
    } else {
      this.formValid = false;
      // Mark all fields as touched to trigger validation messages
    }
  }

  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }
} 