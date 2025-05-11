import { Component, OnInit } from '@angular/core';
import { Book } from '../../core/models/book';
import { OrderService } from '../../core/services/order.service';
import { BookService } from '../../core/services/book.service';
import { Observable, forkJoin, switchMap, of, map } from 'rxjs';
import { BookReviewComponent } from "../books/book-review/book-review.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-purchases',
  imports: [BookReviewComponent, RouterModule],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.css'
})
export class PurchasesComponent implements OnInit {

  userId = JSON.parse(localStorage.getItem("user")!).id;
  allUserBooks: Book[] = [];
  allBooksPurchaseDate : {[bookId: string]: string} = {};

  constructor(private orderService: OrderService, private bookService: BookService){}

ngOnInit(): void {
  this.getPurchasedBooks(this.userId).subscribe(books => {
    this.allUserBooks = books;
});
}

  getPurchasedBooks(userId: string): Observable<Book[]> {
    return this.orderService.getUserOrders(userId).pipe(
      switchMap(orders => {
        // Get all unique book IDs from all orders
        const bookIds = new Set<string>();
        orders.forEach(order => {
          order.items.forEach(item => {
            bookIds.add(item.bookId);
            this.allBooksPurchaseDate[item.bookId] = order.orderDate;
          });
        });

        if (bookIds.size === 0) {
          return of([]);
        }

        // Fetch all unique books
        const bookObservables = Array.from(bookIds).map(bookId =>
          this.bookService.getBookById(bookId).pipe(
            map(book => book as Book) // We know it's not undefined because it was purchased
          )
        );

        return forkJoin(bookObservables);
      })
    );
  }
}
