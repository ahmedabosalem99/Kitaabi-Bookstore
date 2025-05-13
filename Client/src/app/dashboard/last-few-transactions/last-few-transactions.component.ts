// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-last-few-transactions',
//   imports:[CommonModule],
//   templateUrl: './last-few-transactions.component.html',
//   styleUrls: ['./last-few-transactions.component.css']
// })
// export class LastFewTransactionsComponent implements OnInit {

//   transactions = 

//   [
//   {
   
//     "bookId": "41ac",
//     "bookName": "The Great Gatsby",
//     "authorName": "F. Scott Fitzgerald",
//     "categoryId": "1",
//     "type": "add",  
//     "quantity": 5,
//     "price": 15.99,
//      "shop": "Bookstore C",
//     "location": "Chicago, IL",
//     "status":"pending",
//     "imageURL": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhElj8570pLWt3-1C89RVBBmCL8EP85nsVw-kOKplM1Q&s&ec=72940543",
//     "timestamp": "2025-05-03T12:00:00Z"
//   },
//   {
    
//     "bookId": "3527",
//     "bookName": "1984",
//     "authorName": "George Orwell",
//     "categoryId": "1",
//     "type": "add",
//     "quantity": 8,
//     "price": 12.50,
//     "shop": "Bookstore A",
//     "location": "New York, NY",
//     "status":"shipped",
//     "imageURL": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP8jT8OYBTYR48fkbE9rQIoI16sxgf6lSyWc55CKdvUw&s&ec=72940543",
//     "timestamp": "2025-05-03T12:01:00Z"
//   },
//   {

//     "bookId": "dc17",
//     "bookName": "Pride and Prejudice",
//     "authorName": "Jane Austen",
//     "categoryId": "1",
//     "type": "add",
//     "quantity": 12,
//     "price": 9.99,
//     "status":"deliverd",
//      "shop": "Bookstore B",
//     "location": "Los Angeles, CA",
//     "imageURL": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1nYuThqsnJ_iI0px-yuof3kVF-MgjqcOLeGUwjJokgA&s&ec=72940543",
//     "timestamp": "2025-05-03T12:02:00Z"
//   }
// ];



//   constructor() { }

//   ngOnInit(): void {
//   }

// }
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BookService } from '../../core/services/book.service';
import { Book } from '../../core/models/book';

@Component({
  selector: 'app-last-few-transactions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './last-few-transactions.component.html',
  styleUrls: ['./last-few-transactions.component.css']
})
export class LastFewTransactionsComponent implements OnInit {
  topBooks: Book[] = [];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getTopSaledBooks(3).subscribe({
      next: (books) => {
        this.topBooks = books;
      },
      error: (err) => {
        console.error('Error fetching top books:', err);
      }
    });
  }
}
