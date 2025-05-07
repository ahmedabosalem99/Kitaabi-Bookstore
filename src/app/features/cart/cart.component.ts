import { AfterViewInit, Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, RouterLink, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements AfterViewInit  {
  cartService = inject(CartService);
  auth = inject(AuthService);
  userId = this.auth.getUser()?.id ?? ""; // Replace with actual user management

  ngOnInit() {
    console.log(this.userId);
    this.cartService.loadCart(this.userId);
  }

  calculateItemTotal(item: { bookQuantity: number; book: { price: string } }): number {
    return Number(item.book.price) * item.bookQuantity;
  }

    // cart.component.ts
  updateQuantity(bookId: string, newQuantity: number) {
    if (newQuantity < 1) return;
    this.cartService.updateQuantity(bookId, newQuantity);
  }

  removeItem(bookId: string) {
    this.cartService.removeItem(bookId);
  }

  ngAfterViewInit() {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl)
    });
  }
}
