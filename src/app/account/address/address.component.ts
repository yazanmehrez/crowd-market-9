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

  openEditAddressDialog(address: AddressModel) {
    let dialogRef = this.dialog.open(AddressDialogComponent);
    dialogRef.componentInstance.data = address;
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.address.push(result);
      }
    });
  }


  removeAddress(item: AddressModel) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete the address?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
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
          'Deleted!',
          'Your account has been deleted.',
          'success'
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
