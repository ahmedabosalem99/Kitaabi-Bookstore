import { Component, Inject, OnInit } from '@angular/core';
import { BookService } from '../../../core/services/book.service';
import { CategoryService } from '../../../core/services/category.service';
import { forkJoin } from 'rxjs';
import { Book } from '../../../core/models/book';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WishlistIconComponent } from "../../wishlist-icon/wishlist-icon.component";
import { WishlistService } from '../../../core/services/wishlist.service';
import { Wishlist } from '../../../core/models/wishlist';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-book-search',
  standalone: true,
  imports: [CommonModule, FormsModule, WishlistIconComponent],
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.css']
})
export class BookSearchComponent implements OnInit {
  searchQuery = '';
  searchResults: Book[] = [];
  featuredBooks: Book[] = [];
  isLoading = false;
  error = '';
  searchPerformed = false;

  //constructor(public authService:AuthService,private bookService: BookService, private categoryService: CategoryService,private cartService:CartService) {}
  bookWishListIds: string[] = [];
  private readonly userId: string;

  constructor(private bookService: BookService,private cartService:CartService,
    private categoryService: CategoryService,
    private wishlistService: WishlistService,
    public authService: AuthService) {
      this.userId = this.authService.getUser()?.id ?? "";
    }

  ngOnInit(): void {
    this.loadFeaturedBooks();
  }

  performSearch(): void {
    // if (!this.searchQuery.trim()) return;


    this.isLoading = true;
    this.searchPerformed = true;
    const lowerSearchQuery = this.searchQuery.toLowerCase();

    forkJoin({
      books: this.bookService.getBooks(),
      categories: this.categoryService.getCategories()
    }).subscribe({
      next: ({ books, categories }) => {
        if(lowerSearchQuery){
        const isCategory = categories.find(cat => cat.name.toLocaleLowerCase().includes(lowerSearchQuery))?.id;
          books = books.filter(book => book.bookName.toLowerCase().includes(lowerSearchQuery) ||
                    book.authorName.toLowerCase().includes(lowerSearchQuery) ||
                    book.categoryId === isCategory);
        }

        this.searchResults = books.map(book => {
          // const category = categories.find(cat => cat.id === book.categoryId);
          return {
            ...book,
            // categoryName: category ? category.name : 'Unknown Category'
          };
        });
        this.error = '';
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'An error occurred while searching.';
        this.isLoading = false;
      }
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.searchPerformed = false;
    this.error = '';
  }

  private loadFeaturedBooks(): void {
    this.bookService.getBooks().subscribe((books) => {
      this.featuredBooks = books.slice(0, 8); // show top 8 as featured
    });

    this.wishlistService.getWishlist(this.userId).subscribe({
      next: (wishlists: Wishlist[]) => {
        const wishlist = wishlists[0];
        console.log(wishlist);
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
      error: (err: any) => {
        this.error = 'Failed to load wishlist. Please try again later.';
        this.isLoading = false;
        console.error(err);
      },
    });
  }


  addToWishlist(bookId: string){
    this.wishlistService.addToWishList(this.userId, bookId);
    this.bookWishListIds.push(bookId);
  }

  removeFromWishlist(bookId: string){
    this.wishlistService.removeFromWishList(this.userId, bookId);
    this.bookWishListIds = this.bookWishListIds.filter(id => id != bookId);
  }

  addToCart(bookId:string) {
    //console.log("hellooooooooooooooo");
    this.bookService.getBookById(bookId).subscribe({
      next: (_book) => {
        //console.log(_book);
        this.cartService.addToCart(_book);
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
    //console.log(bookId);
  }

}
