import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {DataService} from '../../../services/data.service';
import {FormBuilder} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {AddressDialogComponent} from '../../dialogs/address-dialog/address-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {AddressModel} from '../../../models/address.model';
import {AppService} from '../../app.service';
import {AccountModel} from "../../../models/Account.model";
import Swal from "sweetalert2";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  address: AddressModel[] = [];

  constructor(private restService: DataService,
              private fb: FormBuilder,
              private appService: AppService,
              private dialog: MatDialog,
              private translate: TranslateService,
              private toastr: ToastrService) {

  }


  openAddressDialog() {
    let dialogRef = this.dialog.open(AddressDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.address.push(result);
      }
    });
  }


  getAddresses() {
    this.restService.getAddress().then((res) => {
      if (res.code === 200) {
        this.address = res.data;
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  openEditAddressDialog(addressItem: AddressModel) {
    let dialogRef = this.dialog.open(AddressDialogComponent);
    dialogRef.componentInstance.data = addressItem;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        let index = this.address.indexOf( addressItem);
        this.address[index] = result;
      }
    });
  }


  removeAddress(item: AddressModel) {
    Swal.fire({
      title: this.translate.instant('_AreSure'),
      text: this.translate.instant('_AreSureDeleteAddress'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.translate.instant('_YesDelete'),
      cancelButtonText: this.translate.instant('_NoKeep'),
    })
      .then(result => {
        if (result.value) {
          this.deleteaddress(item.address_id);
        }
      });
  }

  deleteaddress(id) {
    // tslint:disable-next-line:prefer-const
    this.restService.deleteAddress(id).then((res) => {
      if (res.code === 200) {
        this.address = this.address.filter(account => account.address_id !== id);
        Swal.fire(
          this.translate.instant('_Deleted'),
          this.translate.instant('_YourAddressDeleted'),
          this.translate.instant('_Success'),

        );
      } else {
        this.toastr.error(res.message, '');

      }

    }).catch((err: HttpErrorResponse) => {

    });
  }


  ngOnInit() {
    this.getAddresses();
  }

}
