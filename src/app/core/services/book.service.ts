import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../models/book';

import { catchError, map, of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/books';

  // Read
  getBooks() {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getTopSaledBooks(count: number = 3): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl).pipe(
      map(books => books
        .filter(book => book.isApproved)
        .sort((a, b) => Number(b.quantity) - Number(a.quantity))
        .slice(0, count)
      ),
      catchError(this.handleError<Book[]>('getTopSaledBooks', []))
    );
  }

  searchBooksByNameOrAuthor(query: string): Observable<Book[]> {
    const byName = this.http.get<Book[]>(this.apiUrl, {
      params: new HttpParams().set('bookName', query)
    });

    const byAuthor = this.http.get<Book[]>(this.apiUrl, {
      params: new HttpParams().set('authorName', query)
    });

    return forkJoin([byName, byAuthor]).pipe(
      map(([nameResults, authorResults]) => {
        const merged = [...nameResults];
        authorResults.forEach(book => {
          if (!merged.some(b => b.id === book.id)) {
            merged.push(book);
          }
        });
        return merged;
      })
    );
  }

  // Create
  addBook(book: Omit<Book, 'id'>) {
    return this.http.post<Book>(this.apiUrl, book);
  }

  // Update
  updateBook(book: Book) {
    return this.http.put<Book>(`${this.apiUrl}/${book.id}`, book);
  }

  // Delete
  deleteBook(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // book.service.ts
  getBookById(id: string): Observable<Book | undefined> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of(undefined))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    }
  };
}

