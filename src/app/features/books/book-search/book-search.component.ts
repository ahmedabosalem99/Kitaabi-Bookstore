import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../core/services/book.service';
import { CategoryService } from '../../../core/services/category.service';
import { forkJoin } from 'rxjs';
import { Book } from '../../../core/models/book';
import { Category } from '../../../core/models/category'; // تأكد من استيراد النموذج
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(private bookService: BookService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadFeaturedBooks();
  }

  performSearch(): void {
    if (!this.searchQuery.trim()) return;

    this.isLoading = true;
    this.searchPerformed = true;

    forkJoin({
      books: this.bookService.searchBooksByNameOrAuthor(this.searchQuery),
      categories: this.categoryService.getCategories()
    }).subscribe({
      next: ({ books, categories }) => {
        this.searchResults = books.map(book => {
          const category = categories.find(cat => cat.id === book.categoryId);
          return {
            ...book,
            categoryName: category ? category.name : 'Unknown Category'
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
  }
}
