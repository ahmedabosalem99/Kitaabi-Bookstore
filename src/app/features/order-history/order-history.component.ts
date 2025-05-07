import { Component, inject } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { CommonModule, CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BookService } from '../../core/services/book.service'; // Add BookService
import { map, Observable } from 'rxjs'; // Add RxJS operators

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, CurrencyPipe, RouterModule, CommonModule],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent {
  private orderService = inject(OrderService);
  private bookService = inject(BookService); // Inject BookService

  orders: any[] = [];
  loading = true;
  error: string | null = null;
  auth = inject(AuthService);
  userId = this.auth.getUser()?.id ?? "";

  // Cache for book name Observables
  bookNameMap: { [key: string]: Observable<string> } = {};

  ngOnInit() {
    this.orderService.getUserOrders(this.userId).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.populateBookNames(); // Populate cache after receiving orders
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders';
        this.loading = false;
      }
    });
  }

  private populateBookNames() {
    this.orders.forEach(order => {
      order.items.forEach((item: any) => {
        const bookId = item.bookId; // Ensure items have bookId property
        if (bookId && !this.bookNameMap[bookId]) {
          this.bookNameMap[bookId] = this.bookService.getBookById(bookId).pipe(
            map(book => book?.bookName || 'Unknown Book')
          );
        }
      });
    });
  }
}
