import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { Order } from '../../core/models/order';

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

  checkoutForm = this.fb.group({
    name: ['', Validators.required],
    street: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    country: ['', Validators.required]
  });

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

      const order = await this.orderService.createOrder(orderData).toPromise();
      await this.cartService.clearCart(cart.id).toPromise();

      this.orderService.lastOrder.set(order!);
      this.router.navigate(['/order-confirmation', order?.id]);
    } catch (err) {
      this.error = 'Failed to place order. Please try again.';
    } finally {
      this.submitting = false;
    }
  }
}
