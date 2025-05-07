import { Component, Input, inject, OnInit, SimpleChanges } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../core/models/order';
import { CommonModule } from '@angular/common';
import { BookService } from '../../core/services/book.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {
  @Input() order?: Order; // Input property for parent component binding
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);


  bookNameMap: { [key: string]: Observable<string> } = {};
  private populateBookNames() {
    if (this.order) {
      this.order.items.forEach(item => {
        if (!this.bookNameMap[item.bookId]) {
          this.bookNameMap[item.bookId] = this.getBookName(item.bookId);
        }
      });
    }
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['order']) {
      this.populateBookNames();
    }
  }

  ngOnInit() {
    if (!this.order) {
      const orderId = this.route.snapshot.paramMap.get('id');
      if (orderId) {
        this.orderService.getOrderDetails(orderId).subscribe({
          next: (order) => {
            this.order = order;
            this.populateBookNames();
          },
          error: () => console.error('Failed to load order')
        });
      }
    } else {
      this.populateBookNames();
    }
  }


  // ngOnInit() {
  //   if (!this.order) {
  //     // If no input provided, try to get order from service or API
  //     const orderId = this.route.snapshot.paramMap.get('id');

  //     if (orderId) {
  //       // Fetch order from API if needed
  //       this.orderService.getOrderDetails(orderId).subscribe({
  //         next: (order) => this.order = order,
  //         error: () => console.error('Failed to load order')
  //       });
  //     } else {
  //       // Fall back to last order from service
  //       //this.order = this.orderService.lastOrder();
  //     }
  //   }
  // }

  private bookService = inject(BookService);

  getBookName(bookId: string): Observable<string> {
    return this.bookService.getBookById(bookId).pipe(
      map(book => book?.bookName || 'Unknown Book')
    );
  }
}
