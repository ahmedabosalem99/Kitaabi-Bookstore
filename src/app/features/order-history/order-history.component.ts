import { Component, inject } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { CommonModule, CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, CurrencyPipe, RouterModule, CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent {
  private orderService = inject(OrderService);

  orders: any[] = [];
  loading = true;
  error: string | null = null;
  userId = '3'; // Replace with actual user ID management

  ngOnInit() {
    this.orderService.getUserOrders(this.userId).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders';
        this.loading = false;
      }
    });
  }
}
