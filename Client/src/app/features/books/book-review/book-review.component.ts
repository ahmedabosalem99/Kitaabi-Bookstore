import { Component, Input, output, signal, computed, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Book } from '../../../core/models/book';
import { NgClass, CurrencyPipe } from '@angular/common';
import { ReviewService } from '../../../core/services/review.service';
import { Review } from '../../../core/models/review';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-book-review',
  imports: [ReactiveFormsModule, NgClass, CurrencyPipe],
  templateUrl: './book-review.component.html',
  styleUrl: './book-review.component.css'
})
export class BookReviewComponent {
  @Input() book: Book = {} as Book;
  @Input() purchaseDate: string = "";

  reviewSubmitted = output<{bookId: string, rating: number, comment: string}>();
  reviewDeleted = output<string>();

  // Services
  private reviewService = inject(ReviewService);

  // Signals for reactive state management
  stars = signal([1, 2, 3, 4, 5]);
  selectedRating = signal(0);
  hoverRating = signal(0);
  showReviewForm = signal(false);
  existingReview = signal<Review | null>(null);
  isEditing = signal(false);
  userId = JSON.parse(localStorage.getItem("user")!).id;

  reviewForm: FormGroup;


  constructor(private fb: FormBuilder,  private dialog: MatDialog) {
    this.reviewForm = this.fb.group({
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });

    // Load existing review if any
    effect(() => {
      const book = this.book;
      if (book.id && this.userId) {
        this.loadExistingReview(book.id, this.userId);
      }
    });
  }

  private loadExistingReview(bookId: string, userId: string): void {
    this.reviewService.getReviewByBookAndUser(bookId, userId).subscribe({
      next: (review) => {
        if (review) {
          this.existingReview.set(review);
          this.selectedRating.set(review.rating);
          this.reviewForm.patchValue({ comment: review.comment });
          this.showReviewForm.set(true);
          this.isEditing.set(true);
        } else {
          this.existingReview.set(null);
          this.isEditing.set(false);
        }
      },
      error: (err) => console.error('Failed to load review:', err)
    });
  }

  rate(rating: number): void {
    this.selectedRating.set(rating);
    this.showReviewForm.set(true);
  }

  hoverStar(star: number): void {
    this.hoverRating.set(star);
  }

  resetHover(): void {
    this.hoverRating.set(0);
  }

  submitReview(): void {
    if (this.reviewForm.valid && this.userId) {
      const reviewData : Omit<Review, "id"> = {
        bookId: this.book.id,
        userId: this.userId,
        rating: this.selectedRating(),
        comment: this.reviewForm.get('comment')?.value,
        date:""
      };

      if (this.isEditing() && this.existingReview()) {
        // Update existing review
        const updatedReview: Review = {
          ...this.existingReview()!,
          ...reviewData
        };
        this.reviewService.updateReview(updatedReview).subscribe({
          next: () => {
            console.log('Review updated successfully');
            this.reviewSubmitted.emit(reviewData);
            this.existingReview.set(updatedReview);
          },
          error: (err) => console.error('Failed to update review:', err)
        });
      } else {
        // Create new review
        this.reviewService.createReview(reviewData).subscribe({
          next: (newReview) => {
            console.log('Review created successfully');
            this.reviewSubmitted.emit(reviewData);
            this.existingReview.set(newReview);
            this.isEditing.set(true);
          },
          error: (err) => console.error('Failed to create review:', err)
        });
      }
    }
  }

  deleteReview(): void {
  if (!this.existingReview()) return;

  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '350px',
    data: {
      title: 'Delete Review',
      message: 'Are you sure you want to delete your review? This action cannot be undone.'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.reviewService.deleteReview(this.existingReview()!.id).subscribe({
        next: () => {
          console.log('Review deleted successfully');
          this.reviewDeleted.emit(this.book.id);
          this.resetForm();
        },
        error: (err) => console.error('Failed to delete review:', err)
      });
    }
  });
}
  resetForm(): void {
    this.reviewForm.reset();
    this.selectedRating.set(0);
    this.showReviewForm.set(false);
    this.isEditing.set(false);
    this.existingReview.set(null);
  }

  getStarClass(star: number): string {
    const rating = this.hoverRating() || this.selectedRating();
    return rating >= star ? 'filled' : 'empty';
  }
}
