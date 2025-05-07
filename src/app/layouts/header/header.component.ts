import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
  user = inject(AuthService);
  userId = this.user.getUser()?.id ?? "";
  
  ngOnInit() {
    console.log(this.userId);
    this.cartService.loadCart(this.userId);
  }

  get cartCount() {
    return this.cartService.currentCart()?.totalBooksInCart || 0;
  }
}
