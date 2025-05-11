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

import { RegisterationFormComponent } from './Auth/registeration-form/registeration-form.component';
import { LoginComponent } from './Auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { SuccessComponent } from './features/success/success.component';
import { CancelComponent } from './features/cancel/cancel.component';
import { PurchasesComponent } from './features/purchases/purchases.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'books', component: BookListComponent },

  {
    path: 'books/new',
    component: BookFormComponent,
    canActivate: [adminGuard],
  },
  {
    path: 'books/edit/:id',
    component: BookFormComponent,
    canActivate: [adminGuard],
  },
  { path: 'books/:id', component: BookDetailsComponent, canActivate: [authGuard] },

  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  { path: 'wishlist', component: WishlistComponent, canActivate: [authGuard]},
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  {path: 'success', component: SuccessComponent, canActivate: [authGuard]},
  {path: 'cancel', component: CancelComponent, canActivate: [authGuard]},
  {path: 'purchases', component: PurchasesComponent, canActivate: [authGuard]},

  {
    path: 'orders/:id',
    component: OrderDetailsComponent,
    canActivate: [authGuard], //Should it be authGuard?
  },
  {
    path: 'orders',
    component: OrderHistoryComponent,
    canActivate: [authGuard],
  },
  {
    path: 'order-confirmation/:id',
    component: OrderConfirmationComponent,
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [adminGuard],
  },
  { path: 'register', component: RegisterationFormComponent },
  { path: 'login', component: LoginComponent },

  // { path: 'cart', component: CartComponent },

  // { path: 'checkout', component: CheckoutComponent },
  // { path: 'order-confirmation/:id', component: OrderConfirmationComponent },
  // { path: 'orders', component: OrderHistoryComponent },
  // { path: 'dashboard', component: DashboardComponent },
  // { path: 'orders/:id', component: OrderDetailsComponent  },
  { path: '**', redirectTo: '' }
];
