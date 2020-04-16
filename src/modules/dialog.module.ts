import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {TranslateModule} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
    declarations: [],
    // entryComponents: [
    //   CountiesFoodComponent,
    //   KitchensDialogComponent,
    //   CroppedImageComponent,
    //   AddressDialogComponent,
    //   AddressListComponent,
    //   OrderDetailsComponent,
    //   RateComponent],
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
