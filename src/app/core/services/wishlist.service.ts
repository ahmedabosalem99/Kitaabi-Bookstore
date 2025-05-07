import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Wishlist } from '../models/wishlist';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  private http = inject(HttpClient);
  private readonly wishlistUrl = 'http://localhost:3000/wishlists';

  private wishlistSignal = signal<Wishlist | null>(null);
  readonly wishlistCount = computed(() => this.wishlistSignal()?.bookIds.length || 0);

  loadWishlist(userId: string) {
    this.http.get<Wishlist[]>(`${this.wishlistUrl}?userId=${userId}`).subscribe({
      next: (wishlists) => {
        this.wishlistSignal.set(wishlists[0] || null);
      },
      error: (err) => {
        console.error('Failed to fetch wishlist', err);
        this.wishlistSignal.set(null);
      }
    });
  }

  getWishlist(userId: string): Observable<Wishlist[]> {
    return this.http.get<Wishlist[]>(`${this.wishlistUrl}?userId=${userId}`);
  }

  addToWishList(userId: string, bookId: string): void {
    this.http.get<Wishlist[]>(`${this.wishlistUrl}?userId=${userId}`).subscribe(wishlists => {
      const existingWishlist = wishlists[0];
  
      if (!existingWishlist) {
        // No wishlist found for this user, create one
        const newWishlist = {
          userId: userId,
          bookIds: [bookId]
        };
  
        this.http.post(this.wishlistUrl, newWishlist).subscribe(() => {
          console.log('Wishlist created and book added.');
          this.loadWishlist(userId);
        });
      } else {
        // Wishlist exists, add book if it's not already in the list
        if (!existingWishlist.bookIds.includes(bookId)) {
          const updatedWishlist = {
            ...existingWishlist,
            bookIds: [...existingWishlist.bookIds, bookId]
          };
  
          this.http.put(`${this.wishlistUrl}/${existingWishlist.id}`, updatedWishlist).subscribe(() => {
            console.log('Book added to existing wishlist.');
            this.loadWishlist(userId);
          });
        } else {
          console.log('Book already in wishlist.');
        }
      }
    });
  }

  removeFromWishList(userId: string, bookId: string): void{
    this.http.get<Wishlist[]>(`${this.wishlistUrl}?userId=${userId}`).subscribe(wishlists => {
      const existingWishlist = wishlists[0];
        // Wishlist exists, add book if it's not already in the list
        if (existingWishlist.bookIds.includes(bookId)) {
          const updatedWishlist = {
            ...existingWishlist,
            bookIds: existingWishlist.bookIds.filter(id => id !== bookId)
          };
  
          this.http.put(`${this.wishlistUrl}/${existingWishlist.id}`, updatedWishlist).subscribe(() => {
            console.log('Book removed from wishlist.');
            this.loadWishlist(userId);
          });
        } else {
          console.log('Book is not in wishlist.');
        }
    });
  }


}
