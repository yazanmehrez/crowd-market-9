import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {MealsComponent} from './meals/meals.component';
import {LoginComponent} from './auth/login/login.component';
import {AuthComponent} from './auth/auth.component';
import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';
import {ForgetPasswordComponent} from './auth/forget-password/forget-password.component';
import {VerificationComponent} from './auth/verification/verification.component';
import {AccountComponent} from './account/account.component';
import {ProfileComponent} from './account/profile/profile.component';
import {OrdersComponent} from './account/orders/orders.component';
import {FavouritesComponent} from './account/favourites/favourites.component';
import {AddressComponent} from './account/address/address.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {NotificationComponent} from './notification/notification.component';
import {LoginGuard} from './guards/login.guard';
import {ContactusComponent} from './contactus/contactus.component';
import {RegisterComponent} from './auth/register/register.component';
import {AuthGuard} from "./guards/auth.guard";
import {THANKFULLComponent} from './thankfull/thankfull.component';
import {TermsComponent} from './terms/terms.component';
import {PrivacyComponent} from './privacy/privacy.component';
import {PaymentOnlineComponent} from "./payment-online/payment-online.component";
import {AboutComponent} from "./about/about.component";

const appRoutes: Routes = [

  {path: 'home', component: HomeComponent},
  {path: 'products/:id', component: MealsComponent},
  {path: 'contact-us', component: ContactusComponent},
  {path: 'terms-conditions', component: TermsComponent},
  {path: 'about-us', component: AboutComponent},
  {path: 'privacy-policy', component: PrivacyComponent},
  {path: 'checkout', component: CheckoutComponent, canActivate: [LoginGuard]},
  {path: 'complete-order', component: THANKFULLComponent, canActivate: [LoginGuard]},
  {path: 'notifications', component: NotificationComponent, canActivate: [LoginGuard]},
  {path: 'payment-online/:id', component: PaymentOnlineComponent},

  {path: '', redirectTo: 'home', pathMatch: 'full'},

  {
    path: '', component: AuthComponent,
    canActivate: [AuthGuard],

    children: [
      {path: 'login', component: LoginComponent},
      {path: 'register', component: RegisterComponent},
      {path: 'reset-password', component: ResetPasswordComponent},
      {path: 'forget-password', component: ForgetPasswordComponent},
      {path: 'verification', component: VerificationComponent},
      {path: '', redirectTo: 'login', pathMatch: 'full'},
    ]
  },
  {
    path: 'account', component: AccountComponent,
    canActivate: [LoginGuard],
    children: [
      {path: 'profile', component: ProfileComponent},
      {path: 'orders', component: OrdersComponent},
      {path: 'favourites', component: FavouritesComponent},
      {path: 'address', component: AddressComponent},
      {path: '', redirectTo: 'profile', pathMatch: 'full'},
    ]
  },


  {path: '**', redirectTo: 'home', pathMatch: 'full'},

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: false, useHash: true} // <-- debugging purposes only
    )
  ]
})
export class AppRoutingModule {
}
