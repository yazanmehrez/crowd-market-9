import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AddressModel, CityModel} from '../../../models/address.model';
import {HttpErrorResponse} from '@angular/common/http';
import {DataService} from '../../../services/data.service';
import {ToastrService} from 'ngx-toastr';
import {MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-address-dialog',
  templateUrl: './address-dialog.component.html',
  styleUrls: ['./address-dialog.component.scss']
})
export class AddressDialogComponent implements OnInit {
  addressForm: FormGroup;
  data: AddressModel;
  address: AddressModel;
  Cities: CityModel[] = [];
  City: CityModel;

  constructor(private fb: FormBuilder,
              public matDialogRef: MatDialogRef<AddressDialogComponent>,
              public restService: DataService,
              public dialog: MatDialog,
              private toastr: ToastrService) {
    this.matDialogRef.disableClose = true;

  }

  get f() {
    return this.addressForm.controls;
  }

  prepareForm() {
    this.addressForm = this.fb.group({
      landline: ['', [Validators.minLength(10), Validators.pattern(/^[0-9]+$/)]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^[0-9]+$/)]],
      city_id: ['', [Validators.required]],
      area: ['', [Validators.required]],
      type: ['', [Validators.required]],
      street: ['', [Validators.required]],
      building: ['', [Validators.required]],
      apartment: [''],
      floor: [''],
      additional: [''],

    });
    this.f.type.setValue('1');


  }

  onSubmit() {
    let model: AddressModel = this.addressForm.value as AddressModel;
    this.restService.addAddress(model).then((res) => {
      if (res.code === 200) {
        res.data['City'] = this.City;
        this.matDialogRef.beforeClose().subscribe(() => this.matDialogRef.close(res.data));
        this.dialog.closeAll();
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  getCities() {
    this.restService.getCities().then((res) => {
      if (res.code === 200) {
        this.Cities = res.data;
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }


  ngOnInit() {
    this.prepareForm();
    this.getCities();
    if(this.data) {
      console.log(this.data);
      this.addressForm.patchValue(this.data);
    }
  }

}
