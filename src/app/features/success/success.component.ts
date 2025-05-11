import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StripeService } from '../../core/services/stripe.service'
import { Order } from '../../core/models/order';
import { OrderService } from '../../core/services/order.service';
import { CartService } from '../../core/services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent implements OnInit {
  loading = true;
  paymentSuccess = false;
  paymentDetails: any = null;
  errorMessage: string | null = null;

  orderData:Omit<Order, "id"> = JSON.parse(localStorage.getItem("order")!);
  cartId:string = localStorage.getItem("cartId")!;

  constructor(
    private route: ActivatedRoute,
    private stripeService: StripeService,
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get session ID from URL query parameter
    this.route.queryParams.subscribe(params => {
      const sessionId = params['session_id'];

      if (sessionId) {
        this.checkPaymentStatus(sessionId);
      } else {
        this.loading = false;
        this.errorMessage = 'No session ID found.';
      }
    });
  }

  checkPaymentStatus(sessionId: string): void {
    this.stripeService.checkPayment(sessionId).subscribe({
      next: (result) => {
        this.loading = false;
        this.paymentSuccess = result.success;
        this.paymentDetails = {
          status: result.paymentStatus,
          amount: result.amount,
          currency: result.currency
        };

        this.saveOrder();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Error checking payment status.';
        console.error('Payment check error:', error);
      }
    });
  }

  async saveOrder()
  {
    if(this.paymentSuccess){
      const order = await this.orderService.createOrder(this.orderData).toPromise();
      await this.cartService.clearCart(this.cartId).toPromise();

      this.orderService.lastOrder.set(order!);

      localStorage.removeItem("order");
      localStorage.removeItem("cartId");
      localStorage.removeItem("stripe_session_id");

      setTimeout(() => {
        this.router.navigate(['/order-confirmation', order?.id]);
      }, 5000);
    }
  }
}
