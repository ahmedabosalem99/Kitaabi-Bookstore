import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Review } from '../models/review';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/reviews';

  getReviewsByBookId(bookId: string) {
    return this.http.get<Review[]>(`${this.apiUrl}?bookId=${bookId}`);
  }
}
