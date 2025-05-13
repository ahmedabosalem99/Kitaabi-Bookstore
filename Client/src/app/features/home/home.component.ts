import { Component, OnInit, inject } from '@angular/core';
import { BookService } from '../../core/services/book.service';
import { CommonModule } from '@angular/common';
import { BookSearchComponent } from '../books/book-search/book-search.component';

import { Book } from '../../core/models/book'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BookSearchComponent ,CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  featuredBooks: Book[] = [];

  private bookService = inject(BookService);

  ngOnInit(): void {
    this.bookService.getBooks().subscribe({
      next: (books: Book[]) => {
        console.log('API response:', books);
        this.featuredBooks = books;
      },
      error: (err: any) => console.error(err)
    });
  }

}
