import { Routes } from '@angular/router';
import { AboutComponent } from './components/Pages/about/about.component';
import { FavoritesComponent } from './components/Features/favorites/favorites.component';
import { CartComponent } from './components/Features/cart/cart.component';
import { ProfileComponent } from './components/Pages/profile/profile.component';
import { LoginComponent } from './components/Auth/login/login.component';
import { SignupComponent } from './components/Auth/signup/signup.component';
import { ChangePasswordComponent } from './components/Auth/change-password/change-password.component';
import { BookComponent } from './components/Pages/book/book.component';
import { UpdateUserInfoComponent } from './components/Features/update-user-info/update-user-info.component';
import { CheckoutComponent } from './components/Features/checkout/checkout.component';
import { OrdersComponent } from './components/Features/orders/orders.component';
import { HomeComponent } from './components/Pages/home/home.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { OrderManagementComponent } from './components/admin-dashboard/order-management/order-management.component';
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
  { path: 'admin-dashboard', component: AdminDashboardComponent},
  { path: 'admin/orders', component: OrderManagementComponent},
  // { path: 'admin/edit-book/:id', component: EditBookComponent, canActivate: [AdminGuard] },
  // { path: 'admin/add-book', component: AddBookComponent, canActivate: [AdminGuard] },
  { path: '**', redirectTo: '' }
];
