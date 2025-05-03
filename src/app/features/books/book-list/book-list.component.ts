import { Component } from '@angular/core';
import { BookService } from '../../../core/services/book.service';
import { Book } from '../../../core/models/book';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent {
  books: Book[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private bookService: BookService) {}

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
  }
}
