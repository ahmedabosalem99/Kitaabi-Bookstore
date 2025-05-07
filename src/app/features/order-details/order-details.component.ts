// order-details.component.ts
import { Component, inject } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule,DatePipe, NgIf } from '@angular/common';
import { OrderConfirmationComponent } from '../order-confirmation/order-confirmation.component';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule,DatePipe,NgIf , OrderConfirmationComponent, RouterLink],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'] // Add custom styles if needed
})
export class OrderDetailsComponent {
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);

  order: any;
  loading = true;

  ngOnInit() {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.orderService.getOrderDetails(orderId).subscribe({
        next: (order) => {
          this.order = this.enrichOrderData(order);
          this.loading = false;
        },
        error: () => this.loading = false
      });
    }
  }

  private enrichOrderData(order: any): any {
    // Add status history if not provided by API
    return {
      ...order,
      statusHistory: order.statusHistory || [
        { state: 'Order Placed', date: order.orderDate },
        { state: 'Processing', date: this.addDays(order.orderDate, 1) },
        { state: 'Shipped', date: this.addDays(order.orderDate, 2) },
        { state: 'Delivered', date: this.addDays(order.orderDate, 5) }
      ]
    };
  }

  private addDays(dateString: string, days: number): Date {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date;
  }

  printOrder() {
    window.print();
  }

  reorder() {
    // Implement reorder logic
    console.log('Reorder items from this order');
  }
}
