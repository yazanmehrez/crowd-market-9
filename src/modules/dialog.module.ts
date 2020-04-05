import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatMenuModule,
  MatRadioModule,
  MatSelectModule,
  MatToolbarModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {TranslateModule} from '@ngx-translate/core';
import {DeliveryDetailsComponent} from '../app/dialogs/delivery-details/delivery-details.component';
import {CountiesFoodComponent} from '../app/dialogs/counties-food/counties-food.component';
import {KitchensDialogComponent} from '../app/dialogs/kitchens-dialog/kitchens-dialog.component';
import {CroppedImageComponent} from '../app/dialogs/cropped-image/cropped-image.component';
import {AddressDialogComponent} from '../app/dialogs/address-dialog/address-dialog.component';
import {AddressListComponent} from '../app/dialogs/address-list/address-list.component';
import {OrderDetailsComponent} from '../app/dialogs/order-details/order-details.component';
import {RateComponent} from '../app/dialogs/rate/rate.component';

@NgModule({
  declarations: [],
  entryComponents: [DeliveryDetailsComponent,
    CountiesFoodComponent,
    KitchensDialogComponent,
    CroppedImageComponent,
    AddressDialogComponent,
    AddressListComponent,
    OrderDetailsComponent,
    RateComponent],
  imports: [
    TranslateModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
  ],
  exports: [
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatRadioModule,
    BrowserAnimationsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DialogModule {
}
