import { Component, inject } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe, DatePipe, NgIf } from '@angular/common';
import { OrderConfirmationComponent } from '../order-confirmation/order-confirmation.component';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [NgIf, CurrencyPipe, DatePipe, OrderConfirmationComponent ],
  templateUrl: './order-details.component.html'
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
          this.order = order;
          this.loading = false;
        },
        error: () => this.loading = false
      });
    }
  }
}
