import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { BookListComponent } from './features/books/book-list/book-list.component';
import { BookDetailsComponent } from './features/books/book-details/book-details.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { OrderConfirmationComponent } from './features/order-confirmation/order-confirmation.component';
import { OrderHistoryComponent } from './features/order-history/order-history.component';
import { OrderDetailsComponent } from './features/order-details/order-details.component';
import { BookFormComponent } from './features/books/book-form/book-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WishlistComponent } from './features/wishlist/wishlist.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'books', component: BookListComponent },

  { path: 'books/new', component: BookFormComponent },
  { path: 'books/edit/:id', component: BookFormComponent },
  { path: 'books/:id', component: BookDetailsComponent },

  { path: 'cart', component: CartComponent },
  { path: 'wishlist', component: WishlistComponent},
  { path: 'checkout', component: CheckoutComponent },
  { path: 'order-confirmation/:id', component: OrderConfirmationComponent },
  { path: 'orders', component: OrderHistoryComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'orders/:id', component: OrderDetailsComponent  },
  { path: '**', redirectTo: '' }
];
