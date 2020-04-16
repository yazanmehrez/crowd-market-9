import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {MainComponent} from './main/main.component';
import {AppRoutingModule} from './app-routing.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HomeComponent} from './home/home.component';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MDBBootstrapModule} from 'angular-bootstrap-md';
import {MatTabsModule} from '@angular/material/tabs';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {KitchensComponent} from './kitchens/kitchens.component';
import {KitchenComponent} from './kitchen/kitchen.component';
import {MealsComponent} from './meals/meals.component';
import {MatGoogleMapsAutocompleteModule} from '@angular-material-extensions/google-maps-autocomplete';
import {AgmCoreModule} from '@agm/core';
import {ShareButtonModule} from '@ngx-share/button';
import {SlickCarouselModule} from 'ngx-slick-carousel';
import {LoginComponent} from './auth/login/login.component';
import {ForgetPasswordComponent} from './auth/forget-password/forget-password.component';
import {ResetPasswordComponent} from './auth/reset-password/reset-password.component';
import {AuthComponent} from './auth/auth.component';
import {VerificationComponent} from './auth/verification/verification.component';
import {ToastrModule} from 'ngx-toastr';
import {DialogModule} from '../modules/dialog.module';
import {OwlDateTimeModule, OwlNativeDateTimeModule} from 'ng-pick-datetime';
import {JWT_OPTIONS, JwtHelperService} from '@auth0/angular-jwt';
import {InterceptorProvider} from './_helpers/interceptor';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';
import {CountiesFoodComponent} from './dialogs/counties-food/counties-food.component';
import {KitchensDialogComponent} from './dialogs/kitchens-dialog/kitchens-dialog.component';
import {AccountComponent} from './account/account.component';
import {ProfileComponent} from './account/profile/profile.component';
import {FavouritesComponent} from './account/favourites/favourites.component';
import {OrdersComponent} from './account/orders/orders.component';
import {AddressComponent} from './account/address/address.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {CroppedImageComponent} from './dialogs/cropped-image/cropped-image.component';
import {AddressDialogComponent} from './dialogs/address-dialog/address-dialog.component';
import {BankingCardsComponent} from './account/banking-cards/banking-cards.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AsyncPipe} from '@angular/common';
import {MessagingService} from '../services/messaging.service';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireMessagingModule} from '@angular/fire/messaging';
import {CheckoutComponent} from './checkout/checkout.component';
import {OffersComponent} from './offers/offers.component';
import {AddressListComponent} from './dialogs/address-list/address-list.component';
import {RateComponent} from './dialogs/rate/rate.component';
import {OrderDetailsComponent} from './dialogs/order-details/order-details.component';
import {SubscribeComponent} from './subscribe/subscribe.component';
import {NotificationComponent} from './notification/notification.component';
import {AuthServiceConfig, FacebookLoginProvider, GoogleLoginProvider, SocialLoginModule} from 'angularx-social-login';
import {ProductsSliderComponent} from './home/products-slider/products-slider.component';
import {HomepageSliderComponent} from './home/homepage-slider/homepage-slider.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {FarmerDetailsComponent} from './farmer-details/farmer-details.component';
import {ContactusComponent} from './contactus/contactus.component';
import {RegisterComponent} from './auth/register/register.component';
import {ListShimmerComponent} from './components/list-shimmer/list-shimmer.component';
import {SocialIntegrationComponent} from './auth/social-integration/social-integration.component';
import {ServiceProviderRegisterComponent} from './auth/service-provider-register/service-provider-register.component';
import {NguCarouselModule} from '@stockopedia/carousel';


export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');

}

const config = new AuthServiceConfig([
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('864914379697-nijkutc8jsscpd1uegf7ccqucvo0n8a6.apps.googleusercontent.com')
    },
    {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider('484946702107364')
    }
]);

export function provideConfig() {
    return config;
}


@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        MainComponent,
        HomeComponent,
        KitchensComponent,
        KitchenComponent,
        MealsComponent,
        LoginComponent,
        ForgetPasswordComponent,
        ResetPasswordComponent,
        AuthComponent,
        VerificationComponent,
        CountiesFoodComponent,
        KitchensDialogComponent,
        AccountComponent,
        ProfileComponent,
        FavouritesComponent,
        OrdersComponent,
        AddressComponent,
        CroppedImageComponent,
        AddressDialogComponent,
        BankingCardsComponent,
        CheckoutComponent,
        OffersComponent,
        AddressListComponent,
        RateComponent,
        OrderDetailsComponent,
        SubscribeComponent,
        NotificationComponent,
        ProductsSliderComponent,
        HomepageSliderComponent,
        FarmerDetailsComponent,
        ContactusComponent,
        RegisterComponent,
        SocialIntegrationComponent,
        ServiceProviderRegisterComponent,
        RegisterComponent,
        ListShimmerComponent
    ],
    imports: [
        BrowserModule,
        MatTabsModule,
        AppRoutingModule,
        HttpClientModule,
        MatStepperModule,
        DialogModule,
        MatButtonModule,
        MatInputModule,
        MatRadioModule,
        ImageCropperModule,
        FormsModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatAutocompleteModule,
        BrowserAnimationsModule,
        NgbModule,
        InfiniteScrollModule,
        MatCheckboxModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        RouterModule,
        SlickCarouselModule,
        ShareButtonModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        AngularFireDatabaseModule,
        AngularFireAuthModule,
        AngularFireMessagingModule,
    NguCarouselModule,
        AngularFireModule.initializeApp(environment.firebase),
        ToastrModule.forRoot({
            timeOut: 10000,
            positionClass: 'toast-bottom-right',
            preventDuplicates: false,
        }),
    SocialLoginModule,

        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAl_KkpIB-kNu2GIhc4Kxejd0DDESQWMRM',
            // apiKey: 'AIzaSyAl_KkpIB-kNu2GIhc4Kxejd0DDESQWMRM',
            libraries: ['places']
        }),
        MatGoogleMapsAutocompleteModule,
        MDBBootstrapModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (createTranslateLoader),
                deps: [HttpClient]
            },
        }),

    ],

    providers: [JwtHelperService,
        {provide: JWT_OPTIONS, useValue: JWT_OPTIONS},
        {provide: HTTP_INTERCEPTORS, useClass: InterceptorProvider, multi: true},
        MessagingService, AsyncPipe,
        {
            provide: AuthServiceConfig,
            useFactory: provideConfig
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
