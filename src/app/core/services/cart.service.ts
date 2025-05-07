import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Cart } from '../models/cart';
import { User } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private user = this.auth.getUser();

  private apiUrl = 'http://localhost:3000/carts';

  currentCart = signal<Cart | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  loadCart(userId: string) {
    this.loading.set(true);
    this.http.get<Cart[]>(`${this.apiUrl}?userId=${userId}`).subscribe({
      next: (carts) => {
        this.currentCart.set(carts[0] || null);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load cart');
        this.loading.set(false);
      }
    });
  }

  getTotal(): number {
    const cart = this.currentCart();
    if (!cart) return 0;
    return cart.cartBooks.reduce((acc, item) =>
      acc + (Number(item.book.price) * item.bookQuantity), 0
    );
  }

  addToCart(book: any) {
    const currentCart = this.currentCart();
    const userId = this.user?.id ?? ""; // Hardcoded for example - replace with real user management

    if (!currentCart) {
      this.createNewCart(userId, book);
    } else {
      this.updateExistingCart(currentCart, book);
    }
  }

  private createNewCart(userId: string, book: any) {
    const newCart = {
      userId,
      totalBooksInCart: 1,
      cartBooks: [{
        bookQuantity: 1,
        book: book
      }]
    };

    this.http.post<Cart>(this.apiUrl, newCart).subscribe(cart => {
      this.currentCart.set(cart);
    });
  }

  private updateExistingCart(cart: Cart, book: any) {
    const existingItem = cart.cartBooks.find(item => item.book.id === book.id);

    if (existingItem) {
      existingItem.bookQuantity++;
    } else {
      cart.cartBooks.push({
        bookQuantity: 1,
        book: book
      });
    }
    cart.totalBooksInCart = cart.cartBooks.length;

    this.http.patch<Cart>(`${this.apiUrl}/${cart.id}`, cart).subscribe(updatedCart => {
      this.currentCart.set(updatedCart);
    });
  }

  // cart.service.ts
  updateQuantity(bookId: string, newQuantity: number) {
    const cart = this.currentCart();
    if (!cart) return;

    const item = cart.cartBooks.find(i => i.book.id === bookId);
    if (item) {
      item.bookQuantity = newQuantity;
      //cart.totalBooksInCart = cart.cartBooks.reduce((acc, i) => acc + i.bookQuantity, 0);

      this.http.patch(`${this.apiUrl}/${cart.id}`, cart).subscribe({
        next: (updatedCart: any) => this.currentCart.set(updatedCart),
        error: () => alert('Failed to update quantity')
      });
    }
  }

  removeItem(bookId: string) {
    const cart = this.currentCart();
    if (!cart) return;

    cart.cartBooks = cart.cartBooks.filter(i => i.book.id !== bookId);
    cart.totalBooksInCart = cart.cartBooks.reduce((acc, i) => acc + i.bookQuantity, 0);

    this.http.patch(`${this.apiUrl}/${cart.id}`, cart).subscribe({
      next: (updatedCart: any) => this.currentCart.set(updatedCart),
      error: () => alert('Failed to remove item')
    });
  }

  clearCart(cartId: string) {
    return this.http.patch(`${this.apiUrl}/${cartId}`, {
      cartBooks: [],
      totalBooksInCart: 0
    });
  }
}
