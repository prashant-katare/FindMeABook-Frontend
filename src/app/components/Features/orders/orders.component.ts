import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Order, OrderItem } from '../../../core/models/order.model';
import { OrderService } from '../../../core/services/order.service';
import { StorageService } from '../../../core/services/storage.service';
@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error: string | null = null;

  constructor(private orderService: OrderService, private storageService: StorageService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    const userId = this.storageService.getUserIdFromToken();
    if (userId) {
      this.orderService.getAllUserOrders(userId).subscribe({
        next: (orders: Order[]) => {
          this.orders = orders;
          this.loading = false;
          console.log('Orders loaded successfully:', this.orders);
        },
        error: (error: any) => {
          this.error = 'Failed to load orders';
          this.loading = false;
          console.error('Error loading orders:', error);
        }
      });
    } else {
      this.error = 'User not authenticated';
      this.loading = false;
    }
  }
} 