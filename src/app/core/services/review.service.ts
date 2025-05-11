import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Review } from '../models/review';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/reviews';

  getReviewsByBookId(bookId: string) {
    return this.http.get<Review[]>(`${this.apiUrl}?bookId=${bookId}`);
  }

  getReviewByBookAndUser(bookId: string, userId: string) {
    return this.http.get<Review[]>(`${this.apiUrl}?bookId=${bookId}&userId=${userId}`)
      .pipe(
        map(reviews => reviews.length > 0 ? reviews[0] : null)
      );
  }

  createReview(review: Omit<Review, 'id'>) {
    const newReview = {
      ...review,
      id: this.generateId(),
      date: new Date().toISOString()
    };
    return this.http.post<Review>(this.apiUrl, newReview);
  }

  updateReview(review: Review) {
    review.date = new Date().toISOString();
    return this.http.put<Review>(`${this.apiUrl}/${review.id}`, review);
  }

  deleteReview(reviewId: string) {
    return this.http.delete(`${this.apiUrl}/${reviewId}`);
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}
