import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookService, Order } from '../../../services/book.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.css']
})
export class OrderManagementComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error: string | null = null;
  statusOptions = ['Confirmed', 'Shipped', 'Out for Delivery','Delivered', 'Cancelled'];
  expandedOrderId: string | null = null;
  
  constructor(
    private bookService: BookService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check if user has admin role
    if (!this.authService.hasAdminRole()) {
      this.error = 'Unauthorized access';
      this.loading = false;
      return;
    }
    
    this.loadAllOrders();
  }

  loadAllOrders(): void {
    this.bookService.getAllUserOrders().subscribe(
      (orders: Order[]) => {
        this.orders = orders;
        this.loading = false;
      },
      (error: any) =>  {
        this.error = 'Failed to load orders';
        this.loading = false;
        console.error('Error loading orders:', error);
      }
    );
  }

  updateOrderStatus(orderId: string, newStatus: string): void {
    // this.bookService.updateOrderStatus(orderId, newStatus).subscribe({
    //   next: () => {
    //     // Update the local order status
    //     const orderIndex = this.orders.findIndex(order => order.id === orderId);
    //     if (orderIndex !== -1) {
    //       this.orders[orderIndex].status = newStatus;
    //     }
    //     alert(`Order #${orderId} status updated to ${newStatus}`);
    //   },
    //   error: (error: any) => {
    //     console.error('Failed to update order status:', error);
    //     alert('Failed to update order status. Please try again.');
    //   }
    // });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'PROCESSING': return 'status-processing';
      case 'SHIPPED': return 'status-shipped';
      case 'DELIVERED': return 'status-delivered';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  }

  toggleOrderDetails(orderId: string): void {
    if (this.expandedOrderId === orderId) {
      // If this order is already expanded, collapse it
      this.expandedOrderId = null;
    } else {
      // Otherwise, expand this order
      this.expandedOrderId = orderId;
    }
  }
} 