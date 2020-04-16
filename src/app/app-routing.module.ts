import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {KitchensComponent} from './kitchens/kitchens.component';
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
import {OffersComponent} from './offers/offers.component';
import {NotificationComponent} from './notification/notification.component';
import {LoginGuard} from './guards/login.guard';
import {FarmerDetailsComponent} from './farmer-details/farmer-details.component';
import {ContactusComponent} from './contactus/contactus.component';
import {RegisterComponent} from './auth/register/register.component';
import {ServiceProviderRegisterComponent} from './auth/service-provider-register/service-provider-register.component';

const appRoutes: Routes = [

  {path: 'home', component: HomeComponent},
  {path: 'farmers', component: KitchensComponent},
  {path: 'products', component: MealsComponent},
  {path: 'contact-us', component: ContactusComponent},
  {path: 'farmer/:id', component: FarmerDetailsComponent},
  {path: 'checkout', component: CheckoutComponent
    // , canActivate: [LoginGuard]
  },
  {path: 'notifications', component: NotificationComponent , canActivate: [LoginGuard]},
  {path: 'offers', component: OffersComponent},
  {
    path: '', component: AuthComponent,
    // canActivate: [AuthGuard],

    children: [
      {path: 'login', component: LoginComponent},
      {path: 'register', component: RegisterComponent},
      {path: 'reset-password', component: ResetPasswordComponent},
      {path: 'forget-password', component: ForgetPasswordComponent},
      {path: 'verification', component: VerificationComponent},
      {path: 'service-provider', component: ServiceProviderRegisterComponent},

      {path: '', redirectTo: 'login', pathMatch: 'full'},
    ]
  },
  {
    path: 'account', component: AccountComponent,
    // canActivate: [LoginGuard],
    children: [
      {path: 'profile', component: ProfileComponent},
      {path: 'orders', component: OrdersComponent},
      {path: 'favourites', component: FavouritesComponent},
      {path: 'address', component: AddressComponent},
      {path: '', redirectTo: 'profile', pathMatch: 'full'},
    ]
  },
  {path: '', redirectTo: 'home', pathMatch: 'full'},


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
