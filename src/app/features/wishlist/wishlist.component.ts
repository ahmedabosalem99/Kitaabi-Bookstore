
import { Book } from '../../core/models/book';
import { Wishlist } from '../../core/models/wishlist';
import { WishlistService } from './../../core/services/wishlist.service';
import { Component, OnInit } from '@angular/core';
import { BookService } from '../../core/services/book.service';
import { AuthService } from '../../core/services/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  standalone:true,
  imports: [RouterModule, CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {

  constructor(private wishlistService: WishlistService, private bookService: BookService,
    authService: AuthService
  ){
    this.userId = authService.getUser()?.id ?? "";
  }

  isLoading: boolean = true;
  error: string | null = null;
  router: any;

  books: Book[] = [];
  private readonly userId: string;

  ngOnInit(): void {
    this.wishlistService.getWishlist(this.userId).subscribe({
      next: (wishlists: Wishlist[]) => {
        const wishlist = wishlists[0];
        if (wishlist && wishlist.bookIds.length > 0) {
          this.bookService.getBooks().subscribe({
            next: (books) => {
              this.books = books.filter(book => wishlist.bookIds.includes(book.id));
              this.isLoading = false;
            },
            error: (err) => {
              this.error = 'Failed to load books. Please try again later.';
              this.isLoading = false;
              console.error(err);
            },
          });
        } else {
          this.books = [];
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.error = 'Failed to load wishlist. Please try again later.';
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  navigateToAdd() {
    this.router.navigate(['/books/new']);
  }

  removeFromWishlist(bookId: string){
    this.wishlistService.removeFromWishList(this.userId, bookId);
    this.books = this.books.filter(book => book.id != bookId);
  }

}
