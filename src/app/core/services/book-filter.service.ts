import { CategoryService } from './category.service';
import { HttpClient } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { BookService } from './book.service';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookFilterService {

  private allBooks = signal<Book[]>([]);
  private filters = signal<{
    authors: string[];
    categories: string[];
    prices: string[];
  }>({ authors: [], categories: [], prices: [] });

  constructor(private bookService: BookService, private categoryService: CategoryService) {
      this.loadBooks();
    }


    filteredBooks = computed(() => {
      const all = this.allBooks();
      const f = this.filters();

      return all.filter(book => {
        const matchesAuthor = f.authors.length === 0 || f.authors.includes(book.authorName);
        const matchesCategory = f.categories.length === 0 || f.categories.includes(book.categoryId);
        const matchesPrice = f.prices.length === 0 || this.isPriceInRange(+book.price, f.prices);
        return matchesAuthor && matchesCategory && matchesPrice;
      });
    });

  // filteredBooks = computed(() => {
  //     const all = this.allBooks();
  //     const f = this.filters();

  //     return all.filter(book => {
  //       const matchesAuthor = f.authors.length === 0 || f.authors.includes(book.authorName);
  //       const matchesCategory = f.categories.length === 0 || f.categories.includes(book.categoryId);
  //       const matchesPrice = f.prices.length === 0 || this.isPriceInRange(+book.price, f.prices);
  //       return matchesAuthor && matchesCategory && matchesPrice;
  //     });
  //   });

    loadBooks() {
      this.bookService.getBooks().subscribe(books => this.allBooks.set(books));
    }

    updateFilters(newFilters: Partial<{ authors: string[]; categories: string[]; prices: string[] }>) {
      this.filters.update(prev => ({ ...prev, ...newFilters }));
    }

    private isPriceInRange(price: number, ranges: string[]): boolean {
      return ranges.some(range => {
        const [min, max] = range.split('-').map(Number);
        return price >= min && (!max || price <= max);
      });
    }

    // private isPriceInRange(price: number, ranges: string[]): boolean {
    //   return ranges.some(range => {
    //     const [min, max] = range.split('-').map(Number);
    //     return price >= min && price <= max;
    //   });
    // }


}
