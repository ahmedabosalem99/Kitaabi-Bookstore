import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Order } from '../models/order';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/orders';
  lastOrder = signal<Order | null>(null);

  createOrder(orderData: Omit<Order, 'id'>) {
    return this.http.post<Order>(this.apiUrl, orderData);
  }

  getUserOrders(userId: string) {
    return this.http.get<Order[]>(`${this.apiUrl}?userId=${userId}`);
  }

  getOrderDetails(orderId: string) {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }
}
