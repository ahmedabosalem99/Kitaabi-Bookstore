import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private apiUrl = 'http://localhost:4242';

  constructor(private http: HttpClient) { }

  /**
   * Creates a checkout session with Stripe
   * @returns Observable with the checkout session URL
   */
  createCheckoutSession(order: Omit<Order, 'id'>): Observable<{ url: string, sessionId: string }> {
    return this.http.post<{ url: string, sessionId: string }>(
      `${this.apiUrl}/api/create-checkout-session`,{order}
    );
  }

  /**
   * Simple payment status check by session ID
   */
  checkPayment(sessionId: string | null): Observable<{
    success: boolean,
    paymentStatus: string,
    amount: number,
    currency: string
  }> {
    return this.http.get<{
      success: boolean,
      paymentStatus: string,
      amount: number,
      currency: string
    }>(`${this.apiUrl}/api/check-payment/${sessionId}`);
  }
}
