import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppService} from '../app.service';
import {AddressDialogComponent} from '../dialogs/address-dialog/address-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {AddressListComponent} from '../dialogs/address-list/address-list.component';
import {AddressModel} from '../../models/address.model';
import {OrderModel} from '../../models/order.model';
import {DatePipe} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.components.scss'],
  providers: [DatePipe]

})


export class CheckoutComponent implements OnInit {
  deliveryForm: FormGroup;
  orders: any;
  cost = 0;
  shipping: number;
  address: AddressModel;
  products = [];
  start: any;
  end: any;
  currentDate = new Date();
  banners = [{
    image: '/images/banner.png',
  }];

  constructor(private fb: FormBuilder,
              public appService: AppService,
              public datepipe: DatePipe,
              private restService: DataService,
              private dialog: MatDialog,) {
  }

  get f() {
    return this.deliveryForm.controls;
  }

  openAddressDialog() {
    let dialogRef = this.dialog.open(AddressDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.address = result;
        this.f.address_id.setValue(this.address.address_id);
      }
    });
  }

  openListAddressDialog() {
    let dialogRef = this.dialog.open(AddressListComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.address = result;
        this.f.address_id.setValue(this.address.address_id);
      }
    });
  }


  currentDateTime() {
    if (this.f.currentDate.value) {
      this.f.date.setValue(new Date());
      this.f.time.setValue(new Date());
    } else {
      this.f.date.setValue('');
      this.f.time.setValue('');
    }
  }

  creatOrder() {
    this.f.total_price.setValue(this.cost);
    this.f.SubOrders.setValue(this.products);
    this.f.order_timing.setValue(this.datepipe.transform(this.f.date.value, 'MM-dd-yyyy') + ' ' + this.datepipe.transform(this.f.time.value, 'hh:mm a'));
    let model: OrderModel = this.deliveryForm.value as OrderModel;
    this.restService.createOrder(model).then((res) => {
      if (res.code === 200) {
      } else {
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  openEditAddressDialog() {
    let dialogRef = this.dialog.open(AddressDialogComponent);
    dialogRef.componentInstance.data = this.address;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.address = result;
        this.f.address_id.setValue(this.address.address_id);
      }
    });
  }


  prepareForm() {
    this.deliveryForm = this.fb.group({
      order_timing: [''],
      time: ['', [Validators.required]],
      date: ['', [Validators.required]],
      comments: [''],
      currentDate: [''],
      payment_type: ['', [Validators.required]],
      kitchen_id: ['', [Validators.required]],
      address_id: ['', [Validators.required]],
      SubOrders: [''],
      total_price: [''],
      delivery_charges: ['', [Validators.required]],
    });
  }


  getKitchens() {
    this.restService.kitchensDetails(this.orders.kitchen_id).then((res) => {
      if (res.code === 200) {
        this.start = new Date('6/29/2011 ' + res.data.start_time);
        this.end = new Date('6/29/2011 ' + res.data.end_time);
      } else {
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  search(event) {

  }

  ngOnInit() {
    this.prepareForm();
    this.appService.allOrders.subscribe(orders => {
      if (orders) {
        this.orders = orders[0];
        this.cost = 0;
        this.orders.products.forEach(item => {
          this.cost = this.cost + (item.price * item.order_quantity);
          if (item.product_id) {
            this.products.push({product_id: item.product_id, quantity: item.order_quantity});
          }
        });
      }
    });
  }

}
