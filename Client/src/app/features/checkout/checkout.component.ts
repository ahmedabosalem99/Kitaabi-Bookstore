import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { Order } from '../../core/models/order';
import { StripeService } from '../../core/services/stripe.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private stripeService = inject(StripeService);

  checkoutForm = this.fb.group({
    name: ['', Validators.required],
    street: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    country: ['', Validators.required]
  });

  loading = false;
  sessionId: string | null = null; // Store the session ID
  submitting = false;
  error: string | null = null;



  async onSubmit() {
    if (!this.checkoutForm.valid || !this.cartService.currentCart()) return;

    this.submitting = true;
    this.error = null;

    try {
      const cart = this.cartService.currentCart()!;

      // Type-safe shipping address extraction
      const shippingAddress = {
        name: this.checkoutForm.value.name!,
        street: this.checkoutForm.value.street!,
        city: this.checkoutForm.value.city!,
        state: this.checkoutForm.value.state!,
        zip: this.checkoutForm.value.zip!,
        country: this.checkoutForm.value.country!
      };

      const orderData: Omit<Order, 'id'> = {
        userId: cart.userId,
        items: cart.cartBooks.map(item => ({
          bookId: item.book.id,
          quantity: item.bookQuantity,
          price: Number(item.book.price)
        })),
        totalPrice: this.cartService.getTotal(),
        shippingAddress: shippingAddress,
        status: 'pending',
        orderDate: new Date().toISOString(),
        deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      };

      localStorage.setItem("order", JSON.stringify(orderData));
      localStorage.setItem("cartId", cart.id);
      this.initiatePayment(orderData);
      // const order = await this.orderService.createOrder(orderData).toPromise();
      // await this.cartService.clearCart(cart.id).toPromise();

      // this.orderService.lastOrder.set(order!);
      // this.router.navigate(['/order-confirmation', order?.id]);
    } catch (err) {
      this.error = 'Failed to place order. Please try again.';
    } finally {
      this.submitting = false;
    }
  }


  initiatePayment(order:Omit<Order, 'id'>): void {
    this.loading = true;

    this.stripeService.createCheckoutSession(order)
      .subscribe({
        next: (response) => {
          // Store the session ID
          this.sessionId = response.sessionId;

          // Save session ID to localStorage for backup verification
          localStorage.setItem('stripe_session_id', response.sessionId);

          // Redirect to Stripe Checkout
          window.location.href = response.url;
        },
        error: (error) => {
          console.error('Error creating checkout session:', error);
          this.loading = false;
          alert('An error occurred. Please try again.');
        }
      });
  }
}
