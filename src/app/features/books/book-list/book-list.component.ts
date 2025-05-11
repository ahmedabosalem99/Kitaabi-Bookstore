import { Component, inject } from '@angular/core';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../../core/services/wishlist.service';
import { Wishlist } from '../../../core/models/wishlist';
import { WishlistIconComponent } from "../../wishlist-icon/wishlist-icon.component";
import { BookFilterComponent } from "../book-filter/book-filter.component";
import { BookFilterService } from '../../../core/services/book-filter.service';
import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule, WishlistIconComponent, BookFilterComponent],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
})
export class BookListComponent {
  books: Book[] = [];
  isLoading = true;
  error: string | null = null;
  router: any;

  private readonly userId: string;

  bookWishListIds: string[] = [];



  constructor(private bookService: BookService, private wishlistService: WishlistService,
    private bookFilterService: BookFilterService, public authService: AuthService) {
      this.userId = this.authService.getUser()?.id ?? "";
    }




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
      },
    });

    this.books = this.bookFilterService.filteredBooks();
    // this.books = this.bookFilterService.filteredBooks();

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
        this.books = this.books.filter((b) => b.id !== id);
      });
    }
  }

  navigateToAdd() {
    this.router.navigate(['/books/new']);
  }


  addToWishlist(bookId: string){
    this.wishlistService.addToWishList(this.userId, bookId);
    this.bookWishListIds.push(bookId);
  }

  removeFromWishlist(bookId: string){
    this.wishlistService.removeFromWishList(this.userId, bookId);
    this.bookWishListIds = this.bookWishListIds.filter(id => id != bookId);
  }

  // onFiltersApplied(): void {
  //   this.books = this.bookFilterService.filteredBooks();
  // }

  // onFiltersApplied(filters: any): void {
  //   this.books = this.bookFilterService.filteredBooks();
  // }

  // private isPriceInRange(price: number, priceRanges: string[]): boolean {
  //   // Logic to match price range, for example:
  //   return priceRanges.some(range => {
  //     if (range === '< $10') return price < 10;
  //     if (range === '$10 - $20') return price >= 10 && price <= 20;
  //     if (range === '> $20') return price > 20;
  //     return false;
  //   });
  // }

  // private isPriceInRange(price: number, priceRanges: string[]): boolean {
  //   return priceRanges.some(range => {
  //     const [min, max] = range.split('-').map(Number);
  //     return price >= min && (!max || price <= max);
  //   });
  // }

  currentPage = 1;
  itemsPerPage = 8;

  get paginatedBooks(): Book[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.books.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.books.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onFiltersApplied(): void {
  this.books = this.bookFilterService.filteredBooks();
  this.currentPage = 1;
}
}
