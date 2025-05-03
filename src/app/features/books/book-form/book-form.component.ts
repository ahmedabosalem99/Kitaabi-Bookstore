import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BookService } from '../../../core/services/book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { Book } from '../../../core/models/book';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private bookService = inject(BookService);
  public router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = false;
  bookId?: string;

  // Form matches Book interface types
  bookForm = this.fb.group({
    bookName: ['', Validators.required],
    authorName: ['', Validators.required],
    price: ['', [
      Validators.required,
      Validators.pattern(/^\d+\.?\d*$/) // Validate numeric string
    ]],
    quantity: ['', [
      Validators.required,
      Validators.pattern(/^\d+$/) // Validate numeric string
    ]],
    description: [''],
    imageURL: ['', Validators.required],
    categoryId: ['', Validators.required],
    isApproved: [false]
  });

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.bookId = id;
      this.loadBookForEdit();
    }
  }

  private loadBookForEdit() {
    if (!this.bookId) return;

    this.bookService.getBookById(this.bookId).subscribe({
      next: (book: Book | undefined) => {
        if (book) {
          this.bookForm.patchValue(book);
        } else {
          this.router.navigate(['/not-found']);
        }
      },
      error: () => this.router.navigate(['/error'])
    });
  }

  onSubmit() {
    if (this.bookForm.invalid) return;

    const formValue = this.bookForm.value;

    if (this.isEditMode) {
      // Edit existing book
      const bookData: Book = {
        id: this.bookId!,
        bookName: formValue.bookName || '',
        authorName: formValue.authorName || '',
        price: formValue.price || '0',
        quantity: formValue.quantity || '0',
        description: formValue.description || '',
        imageURL: formValue.imageURL || '',
        categoryId: formValue.categoryId || '',
        isApproved: !!formValue.isApproved
      };

      this.bookService.updateBook(bookData)
        .subscribe(() => this.router.navigate(['/books']));
    } else {
      // Add new book - create without ID
      const newBook: Omit<Book, 'id'> = {
        bookName: formValue.bookName || '',
        authorName: formValue.authorName || '',
        price: formValue.price || '0',
        quantity: formValue.quantity || '0',
        description: formValue.description || '',
        imageURL: formValue.imageURL || '',
        categoryId: formValue.categoryId || '',
        isApproved: !!formValue.isApproved
      };

      this.bookService.addBook(newBook)
        .subscribe({
          next: () => this.router.navigate(['/books']),
          error: (err) => console.error('Add book failed:', err)
        });
    }
  }
}
