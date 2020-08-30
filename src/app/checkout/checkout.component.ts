import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppService} from '../app.service';
import {AddressDialogComponent} from '../dialogs/address-dialog/address-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {AddressListComponent} from '../dialogs/address-list/address-list.component';
import {AddressModel} from '../../models/address.model';
import {OrderGuestGModel, OrderModel} from '../../models/order.model';
import {DatePipe} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {DataService} from '../../services/data.service';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {ICreateOrderRequest, IPayPalConfig} from "ngx-paypal";
import {TranslateService} from "@ngx-translate/core";
import {JwtHelperService} from "@auth0/angular-jwt";
import {FilterModel} from "../../models/filter.model";

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
  discount = 0;
  tax: number;
  total: number;
  discountCoupon: number;
  subtotalDiscount: number;
  products = [];
  lang: string;
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
        console.log(result);
        this.address = result;
        if (this.address.city.active === 0 && this.cost < 250) {
          Swal.fire({
            title: this.translate.instant('_MinOrderFor') + this.address.city.name + this.translate.instant('_Is') + 250 + this.translate.instant('_AED'),
            showClass: {
              popup: 'animated fadeInDown faster'
            },
            hideClass: {
              popup: 'animated fadeOutUp faster'
            }
          });
        }
        if (this.isLogin) {
          this.f.address_id.setValue(this.address.address_id);
        } else {
          this.f.city_id.setValue(this.address.city.city_id);
          this.f.area.setValue(this.address.area);
          this.f.type.setValue(this.address.type);
          this.f.street.setValue(this.address.street);
          this.f.building.setValue(this.address.building);
          this.f.apartment.setValue(this.address.apartment);
          this.f.floor.setValue(this.address.floor);
          this.f.additional.setValue(this.address.additional);
          this.f.phone.setValue(this.address.phone);
        }
      }
    });
  }

  openListAddressDialog() {
    let dialogRef = this.dialog.open(AddressListComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.address = result;
        console.log(result);
        this.f.address_id.setValue(this.address.address_id);
        if (this.address.city.active === 0 && this.cost < 250) {
          Swal.fire({
            title: this.translate.instant('_MinOrderFor') + this.address.city.name + this.translate.instant('_Is') + 250 + this.translate.instant('_AED'),
            showClass: {
              popup: 'animated fadeInDown faster'
            },
            hideClass: {
              popup: 'animated fadeOutUp faster'
            }
          });
        }
      }
    });
  }


  creatOrder() {
    if (this.address.city.active === 0 && this.cost < 250) {
      Swal.fire({
        title: this.translate.instant('_MinOrderFor') + this.address.city.name + this.translate.instant('_Is') + 250 + this.translate.instant('_AED'),
        showClass: {
          popup: 'animated fadeInDown faster'
        },
        hideClass: {
          popup: 'animated fadeOutUp faster'
        }
      });
    } else {
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
  }


  checkCoupone() {
    let filter = new FilterModel();
    filter.coupon = this.f.coupon.value;
    this.restService.checkCoupon(filter).then((res) => {
      if (res.code === 200) {
        this.discount = res.data.value;
        this.discountCoupon = res.data.value;
        this.cost = 0;
        this.orders.forEach(item => {
          this.cost = +(this.cost + (item.price * item.order_quantity)).toFixed(2);
          this.subtotalDiscount = this.discount ? +(this.cost - (this.cost * (this.discount / 100))).toFixed(2) : this.cost;
          this.tax = this.discount ? +(+this.subtotalDiscount * 0.05).toFixed(2) : +(+this.cost * 0.05).toFixed(2);

          // console.log(this.items);
        });
      } else {
        this.toastr.error(this.translate.instant('_CheckCoupon'));
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  cancelCoupon() {

    this.discount = (localStorage.getItem('auth_token_CrowdMarket') && (this.jwtHelper.decodeToken(localStorage.getItem('auth_token_CrowdMarket'))).discount) ? (this.jwtHelper.decodeToken(localStorage.getItem('auth_token_CrowdMarket'))).discount : 0;
    this.discountCoupon = 0;
    this.f.coupon.setValue('');
    this.cost = 0;
    this.orders.forEach(item => {
      this.cost = +(this.cost + (item.price * item.order_quantity)).toFixed(2);
      this.subtotalDiscount = this.discount ? +(this.cost - (this.cost * (this.discount / 100))).toFixed(2) : this.cost;
      this.tax = this.discount ? +(+this.subtotalDiscount * 0.05).toFixed(2) : +(+this.cost * 0.05).toFixed(2);
    });
  }


  registerGuest() {
    if (this.address.city.active === 0 && this.cost < 250) {
      Swal.fire({
        title: this.translate.instant('_MinOrderFor') + this.address.city.name + this.translate.instant('_Is') + 250 + this.translate.instant('_AED'),
        showClass: {
          popup: 'animated fadeInDown faster'
        },
        hideClass: {
          popup: 'animated fadeOutUp faster'
        }
      });
    } else {
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
        let model: OrderGuestGModel = this.deliveryForm.value as OrderGuestGModel;
        this.restService.registerGuest(model).then((res) => {
          if (res.code === 200) {
            if (this.f.payment_type.value === '3') {
              localStorage.setItem('crowd-order-id', res.data.order_id);
              this.router.navigate(['/payment-online/', res.data.paymentDetail.paymentInfo.preAuthToken]);
            } else {
              console.log(this.f.payment_type.value);
              this.router.navigate(['/complete-order']);
            }
          } else {
            this.toastr.error(res.message);
          }
        }).catch((err: HttpErrorResponse) => {
        });
      }
    }
  }

  openEditAddressDialog() {
    let dialogRef = this.dialog.open(AddressDialogComponent);
    dialogRef.componentInstance.data = this.address;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.address = result;
        if (this.address.city.active === 0 && this.cost < 250) {
          Swal.fire({
            title: this.translate.instant('_MinOrderFor') + this.address.city.name + this.translate.instant('_Is') + 250 + this.translate.instant('_AED'),
            showClass: {
              popup: 'animated fadeInDown faster'
            },
            hideClass: {
              popup: 'animated fadeOutUp faster'
            }
          });
        }
        this.f.address_id.setValue(this.address.address_id);
      }
    });
  }


  prepareFormGest() {
    this.deliveryForm = this.fb.group({
      order_timing: [''],
      // time: ['', [Validators.required]],
      // date: ['', [Validators.required]],
      comments: [''],
      // currentDate: [''],
      payment_type: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      city_id: ['', [Validators.required]],
      area: ['', [Validators.required]],
      type: ['', [Validators.required]],
      street: ['', [Validators.required]],
      building: ['', [Validators.required]],
      apartment: [''],
      floor: [''],
      additional: [''],
      phone: ['', [Validators.required]],
      SubOrders: [''],
      total_price: [''],
      delivery_charges: [''],
      subtotal: [''],
      coupon: [''],
      tax: [''],
      discount: [''],

    });
  }

  prepareForm() {
    this.deliveryForm = this.fb.group({
      order_timing: [''],
      comments: [''],
      payment_type: ['', [Validators.required]],
      address_id: ['', [Validators.required]],
      SubOrders: [''],
      total_price: [''],
      delivery_charges: [''],
      subtotal: [''],
      tax: [''],
      discount: [''],
      coupon: [''],

    });
  }


  search(value) {
    if (value) {
      this.appService.keyword = value;
      this.router.navigate(['/products']);
    }
  }


  ngOnInit() {
    window.scrollTo(0, 0);
    this.lang = this.appService.currentLanguage === 'en' ? 'ltr' : 'rtl';

    this.appService.isUserLoggedIn.subscribe((value) => {
      if (value) {
        this.isLogin = value;
        if (this.isLogin) {
          this.prepareForm();
          this.f.order_timing.setValue(this.currentDate);

          this.discount = (this.jwtHelper.decodeToken(localStorage.getItem('auth_token_CrowdMarket'))).discount ? (this.jwtHelper.decodeToken(localStorage.getItem('auth_token_CrowdMarket'))).discount : 0;
        }
      } else {
        this.prepareFormGest();
        this.f.order_timing.setValue(this.currentDate);

      }

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
          this.tax = this.discount ? +(+this.subtotalDiscount * 0.05).toFixed(2) : +(+this.cost * 0.05).toFixed(2);
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
