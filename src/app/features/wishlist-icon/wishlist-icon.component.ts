import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlist-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist-icon.component.html',
  styleUrl: './wishlist-icon.component.css'
})
export class WishlistIconComponent {
  @Input() bookId!: string;
  @Input() bookWishListIds: string[] = [];

  @Output() add = new EventEmitter<string>();
  @Output() remove = new EventEmitter<string>();

  toggleWishlist() {
    if (this.bookWishListIds.includes(this.bookId)) {
      this.remove.emit(this.bookId);
    } else {
      this.add.emit(this.bookId);
    }
  }
}
