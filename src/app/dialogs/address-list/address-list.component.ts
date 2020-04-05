import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {DataService} from '../../../services/data.service';
import {FormBuilder} from '@angular/forms';
import {AppService} from '../../app.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {ToastrService} from 'ngx-toastr';
import {AddressModel} from '../../../models/address.model';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent implements OnInit {
  address: AddressModel[] = [];

  constructor(private restService: DataService,
              private fb: FormBuilder,
              public matDialogRef: MatDialogRef<AddressListComponent>,
              private appService: AppService,
              private dialog: MatDialog,
              private toastr: ToastrService) {

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

  selectAddress(address){
    this.matDialogRef.beforeClose().subscribe(() => this.matDialogRef.close(address));
    this.dialog.closeAll();
  }

  ngOnInit() {
    this.getAddresses();
  }

}
