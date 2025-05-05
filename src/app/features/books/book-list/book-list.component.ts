import { Component } from '@angular/core';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../../core/services/wishlist.service';
import { Wishlist } from '../../../core/models/wishlist';
import { WishlistIconComponent } from "../../wishlist-icon/wishlist-icon.component";

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule, WishlistIconComponent],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent {
  books: Book[] = [];
  isLoading = true;
  error: string | null = null;
  router: any;

  bookWishListIds: string[] = [];

  constructor(private bookService: BookService, private wishlistService: WishlistService) {}

  ngOnInit() {
    this.bookService.getBooks().subscribe({
      next: (data) => {
        this.books = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load books. Please try again later.';
        this.isLoading = false;
        console.log(err);
      }
    });

    this.wishlistService.getWishlist(this.userId).subscribe({
          next: (wishlists: Wishlist[]) => {
            const wishlist = wishlists[0];
            if (wishlist && wishlist.bookIds.length > 0) {
              this.bookService.getBooks().subscribe({
                next: (books) => {
                  this.bookWishListIds = (books.filter(book => wishlist.bookIds.includes(book.id))).map(book => book.id);
                  this.isLoading = false;
                },
                error: (err) => {
                  this.error = 'Failed to load books. Please try again later.';
                  this.isLoading = false;
                  console.error(err);
                },
              });
            } else {
              this.bookWishListIds = [];
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

    // Add to existing component
  deleteBook(id: string) {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(id).subscribe(() => {
        this.books = this.books.filter(b => b.id !== id);
      });
    }
  }

  navigateToAdd() {
    this.router.navigate(['/books/new']);
  }

  private readonly userId: string = "1";
  addToWishlist(bookId: string){
    this.wishlistService.addToWishList(this.userId, bookId);
    this.bookWishListIds.push(bookId);
  }

  removeFromWishlist(bookId: string){
    this.wishlistService.removeFromWishList(this.userId, bookId);
    this.bookWishListIds = this.bookWishListIds.filter(id => id != bookId);
  }

}
