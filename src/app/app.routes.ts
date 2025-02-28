import { Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { CartComponent } from './components/cart/cart.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { BookComponent } from './components/book/book.component';
import { UpdateUserInfoComponent } from './components/update-user-info/update-user-info.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrdersComponent } from './components/orders/orders.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { OrderManagementComponent } from './components/admin/order-management/order-management.component';
// import { EditBookComponent } from './components/admin/edit-book/edit-book.component';
// import { AddBookComponent } from './components/admin/add-book/add-book.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'wishlist', component: FavoritesComponent},
  { path: 'cart', component: CartComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'book/:id', component: BookComponent},
  { path: 'update-profile', component: UpdateUserInfoComponent},
  { path: 'checkout', component: CheckoutComponent},
  { path: 'orders', component: OrdersComponent},
  { path: 'admin', component: AdminComponent},
  { path: 'admin/orders', component: OrderManagementComponent},
  // { path: 'admin/edit-book/:id', component: EditBookComponent, canActivate: [AdminGuard] },
  // { path: 'admin/add-book', component: AddBookComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '' }
];
