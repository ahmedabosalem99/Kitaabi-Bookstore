import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  cartService = inject(CartService);
  wishlistService = inject(WishlistService);

  private readonly userId: string = "1";

  constructor(){
    this.wishlistService.loadWishlist(this.userId);
  }

  get cartCount() {
    return this.cartService.currentCart()?.totalBooksInCart || 0;
  }

  get wishlistCount(){
    return this.wishlistService.wishlistCount;
  }

}
