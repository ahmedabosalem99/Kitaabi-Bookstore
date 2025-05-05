// import { Component, Inject, Input } from '@angular/core';
// import { WishlistService } from '../../core/services/wishlist.service';

// @Component({
//   selector: 'app-wishlist-icon',
//   standalone: true,
//   imports: [],
//   templateUrl: './wishlist-icon.component.html',
//   styleUrl: './wishlist-icon.component.css'
// })
// export class WishlistIconComponent {

//   private wishlistService = Inject(WishlistService);
  
//   bookWishListIds: string[] = [];

//   @Input() bookId: string = "";

  
//   private readonly userId: string = "1";
//   addToWishlist(bookId: string){
//     this.wishlistService.addToWishList(this.userId, bookId);
//     this.bookWishListIds.push(bookId);
//   }

//   removeFromWishlist(bookId: string){
//     this.wishlistService.removeFromWishList(this.userId, bookId);
//     this.bookWishListIds = this.bookWishListIds.filter(id => id != bookId);
//   }

// }

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