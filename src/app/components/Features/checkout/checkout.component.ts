import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../../../core/services/book.service';
import { AuthService } from '../../../core/services/auth.service';
import { CartItemDTO } from '../../../core/models/cart.model';
import { Address } from '../../../core/models/address.model';
import { Order } from '../../../core/models/order.model';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { AddressService } from '../../../core/services/address.service';
import { StorageService } from '../../../core/services/storage.service';

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
    private cartService: CartService,
    private storageService: StorageService,
    private router: Router,
    private addressService: AddressService,
    private orderService: OrderService
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
    const userId = this.storageService.getUserIdFromToken();
    if (!userId) {
      this.error = 'Not authenticated';
      return;
    }

    this.cartService.getCartItems(userId).subscribe({
      next: (items: CartItemDTO[]) => {
        this.cartItems = items;
      },
      error: (err: any) => {
        this.error = 'Failed to load cart items: ' + err.message;
      }
    });
  }

  loadUserAddress(): void {
    const userId = this.storageService.getUserIdFromToken();
    if (!userId) {
      this.error = 'Not authenticated';
      return;
    }

    if (localStorage.getItem('address')) {
        
        this.address = JSON.parse(localStorage.getItem('address') || '{}');
        this.addressLoading = false;
        } else {
            this.addressLoading = true;
              this.addressService.getUserAddress(userId).subscribe({
            next: (data: Address) => {
                    this.address = data;
                this.addressLoading = false;
                //save address to local storage
                localStorage.setItem('address', JSON.stringify(this.address));
            },
        error: (err: any) => {
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
      
      const userId = this.storageService.getUserIdFromToken();
      if (!userId) {
        console.error("User ID not found.");
        this.loading = false;
        return;
      }
  
      this.orderService.placeOrder(userId).subscribe({
        next: (order: Order) => {

          this.orderPlaced = true;
  
          // Clear cart only after successful order placement
          this.cartService.clearCart(userId).subscribe({
            next: () => {
              console.log("Cart cleared successfully.");
            },
            error: (err) => {
              console.error("Failed to clear cart:", err);
            }
          });
        },
        error: (err) => {
          console.error("Failed to place order:", err);
          this.loading = false;  // Stop loading if order placement fails
        },
        complete: () => {
          this.loading = false; // Stop loading once everything completes
        }
      });
    } else {
      this.formValid = false;
      console.warn("Form is invalid. Please check the required fields.");
    }
  }
  



  navigateToCart(): void {
    this.router.navigate(['/cart']);
  }
} 