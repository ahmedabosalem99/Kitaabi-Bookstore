import { Component, inject } from '@angular/core';
import { BookService } from '../../../core/services/book.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Book } from '../../../core/models/book';
import { Review } from '../../../core/models/review';
import { ReviewService } from '../../../core/services/review.service';
import { User } from '../../../core/models/user';
import { UserService } from '../../../core/services/user.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';

// Add this interface
interface ReviewWithUser extends Review {
  user?: User;
}

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent {

  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);
  private cartService = inject(CartService);
  public authService = inject(AuthService);

  book?: Book;
  isLoading = true;

  // Add these properties
  reviews: ReviewWithUser[] = [];
  users: User[] = [];
  showReviewError = false;

  // Inject UserService
  private userService = inject(UserService);

  // Inject ReviewService
  private reviewService = inject(ReviewService);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.bookService.getBookById(id).subscribe({
        next: (book) => {
          this.book = book;
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });

      // Load users first
      this.userService.getUsers().subscribe({
        next: (users) => {
          this.users = users;
          // Then load reviews
          if (id) {
            this.reviewService.getReviewsByBookId(id).subscribe({
              next: (reviews) => {
                this.reviews = reviews.map(review => ({
                  ...review,
                  user: this.users.find(u => u.id === review.userId)
                }));
              },
              error: () => this.showReviewError = true
            });
          }
        },
        error: () => this.showReviewError = true
      });

      // Load reviews after book loads
      this.reviewService.getReviewsByBookId(id).subscribe({
        next: (reviews) => this.reviews = reviews,
        error: () => this.showReviewError = true
      });
    }
  }

  addToCart() {
    if (this.book) {
      this.cartService.addToCart(this.book);
    }
  }

}
