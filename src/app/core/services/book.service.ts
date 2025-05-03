import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../models/book';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/books';

  getBooks() {
    return this.http.get<Book[]>(this.apiUrl);
  }

  // book.service.ts
  getBookById(id: string): Observable<Book | undefined> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of(undefined)) // Handle missing books
    );
  }
}
