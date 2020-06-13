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
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {ICreateOrderRequest, IPayPalConfig} from "ngx-paypal";
import {TranslateService} from "@ngx-translate/core";
import {WelcomeComponent} from "../dialogs/welcome/welcome.component";
import {JwtHelperService} from "@auth0/angular-jwt";

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
  discount: number;
  tax: number;
  total: number;
  subtotalDiscount: number;
  products = [];
  items: any[] = [];
  start: any;
  end: any;
  currentDate = new Date();
  isLogin: string;
  banners = [{
    image: 'assets/images/checkout.jpg',
    description: '_Checkout'

  }];
  public payPalConfig?: IPayPalConfig;

  constructor(private fb: FormBuilder,
              public appService: AppService,
              public datepipe: DatePipe,
              private toastr: ToastrService,
              private router: Router,
              private restService: DataService,
              private translate: TranslateService,
              public jwtHelper: JwtHelperService,
              private dialog: MatDialog) {
  }

  get f() {
    return this.deliveryForm.controls;
  }

  openAddressDialog() {
    let dialogRef = this.dialog.open(AddressDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
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
    if (this.appService.minOrder > this.cost) {
      Swal.fire({
        title: this.translate.instant('_PleaseMakeSure') + this.appService.minOrder + this.translate.instant('_AEDHigher'),
        showClass: {
          popup: 'animated fadeInDown faster'
        },
        hideClass: {
          popup: 'animated fadeOutUp faster'
        }
      });
    } else {
      this.f.total_price.setValue(this.cost);
      this.f.tax.setValue(this.tax);
      let discount: any = this.discount ? (this.cost - this.subtotalDiscount).toFixed(2) : 0;
      this.f.discount.setValue((discount).toString());
      this.f.subtotal.setValue(this.cost);
      this.f.SubOrders.setValue(this.products);
      this.f.total_price.setValue((this.appService.shipping + this.tax + (this.subtotalDiscount)).toFixed(2));
      this.f.delivery_charges.setValue(this.appService.shipping);
      // this.f.order_timing.setValue(this.datepipe.transform(this.f.date.value, 'MM-dd-yyyy') + ' ' + this.datepipe.transform(this.f.time.value, 'hh:mm a'));
      let model: OrderModel = this.deliveryForm.value as OrderModel;
      this.restService.createOrder(model).then((res) => {
        if (res.code === 200) {
          if (this.f.payment_type.value === '3') {
            localStorage.setItem('crowd-order-id', res.data.order_id);
            this.router.navigate(['/payment-online/', res.data.paymentDetail.paymentInfo.preAuthToken]);
          } else {
            this.router.navigate(['/complete-order']);
          }
        } else {
          this.toastr.error(res.message);
        }
      }).catch((err: HttpErrorResponse) => {
      });
    }
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
      // time: ['', [Validators.required]],
      // date: ['', [Validators.required]],
      comments: [''],
      // currentDate: [''],
      payment_type: ['', [Validators.required]],
      address_id: ['', [Validators.required]],
      SubOrders: [''],
      total_price: [''],
      delivery_charges: [''],
      subtotal: [''],
      tax: [''],
      discount: [''],
    });
  }


  search(value) {
    if (value) {
      this.appService.keyword = value;
      this.router.navigate(['/products']);
    }
  }


  ngOnInit() {
    let dialogRef = this.dialog.open(WelcomeComponent);
    window.scrollTo(0, 0);
    this.prepareForm();
    this.f.order_timing.setValue(this.currentDate);
    this.appService.isUserLoggedIn.subscribe((value) => {
      this.isLogin = value;
      this.discount =  (this.jwtHelper.decodeToken(localStorage.getItem('auth_token_CrowdMarket'))).discount

    });
    this.initConfig();
    // this.appService.keyword.next({type: 'search', value: ''});

    this.appService.allOrders.subscribe(orders => {
      if (orders) {
        this.orders = orders;
        this.cost = 0;
        this.orders.forEach(item => {
          this.cost = +(this.cost + (item.price * item.order_quantity)).toFixed(2);
          this.subtotalDiscount = this.discount ? +(this.cost - (this.cost * (this.discount / 100))).toFixed(2) : this.cost;
          this.tax = this.discount ?  +(+this.subtotalDiscount * 0.05).toFixed(2) : +(+this.cost * 0.05).toFixed(2);
          if (item.product_id) {
            this.products.push({product_id: item.product_id, quantity: item.order_quantity, farmer_id: item.farmer_id});
            this.items.push({
              name: item.product_name,
              quantity: item.order_quantity,
              unit_amount: {
                currency_code: 'AED',
                value: item.price * item.order_quantity,
              },
            });
          }
          // console.log(this.items);
        });
      }
    });
  }


  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'AVBY5dy3S1d3llSI0scQtzufHVpp6karV29UfkJAUcsfve0InN8gy6DbnZDCo4QXsY-buTAscgw-FLWR',

      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: (this.appService.shipping + this.tax + this.subtotalDiscount).toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: (this.appService.shipping + this.tax + this.subtotalDiscount).toFixed(2)
                }
              }
            },
            items: [
              // this.items,
              // {
              //   name: 'Enterprise Subscription',
              //   quantity: '1',
              //   unit_amount: {
              //     currency_code: 'EUR',
              //     value: '9.99',
              //   },
              // },
              // {
              //   name: 'Enterprise Subscription',
              //   quantity: '1',
              //   unit_amount: {
              //     currency_code: 'EUR',
              //     value: '9.99',
              //   },
              // }
            ]
          }
        ]
      },
      advanced: {
        commit: 'true'
      }
      ,
      style: {
        label: 'paypal',
        layout:
          'vertical'
      }
      ,
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization:
        (data) => {
          console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
          // this.showSuccess = true;
        },
      onCancel:
        (data, actions) => {
          console.log('OnCancel', data, actions);
        },
      onError:
        err => {
          console.log('OnError', err);
        },
      onClick:
        (data, actions) => {
          console.log('onClick', data, actions);
        },
    };
  }
}
