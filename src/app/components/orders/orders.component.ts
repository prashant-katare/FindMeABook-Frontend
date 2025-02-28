import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookService, Order } from '../../services/book.service';

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
  username: string = localStorage.getItem('username') || '';

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.bookService.getOrders(this.username).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
        console.log('Orders loaded successfully:', this.orders);
      },
      error: (error) => {
        this.error = 'Failed to load orders';
        this.loading = false;
        console.error('Error loading orders:', error);
      }
    });
  }
} 