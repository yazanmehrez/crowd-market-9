import {Component, OnInit} from '@angular/core';
import {AppService} from '../app.service';
import {Router} from '@angular/router';
import {DataService} from '../../services/data.service';
import {AuthService} from 'angularx-social-login';
import {HttpErrorResponse} from '@angular/common/http';
import {Category} from '../../models/category';
import Swal from 'sweetalert2';
import {TranslateService} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  orders: any[] = [];
  cost = 0;
  count = 0;
  name: string;
  notificationCount = 0;
  isLogin: string;
  categories: Category[] = [];

  constructor(public _appService: AppService,
              public restService: DataService,
              private translate: TranslateService,
              private authService: AuthService,
              private dialog: MatDialog,
              private router: Router) {
  }


  deleteOrder(product) {
    this.orders = this.orders.filter(item => item.product_id != product.product_id);
    if (this.orders.length == 0) {
      localStorage.setItem('orders_crowd', '');
      this.orders = [];
      this._appService.allOrders.next(this.orders);
      this.cost = 0;
      if (this.router.url === '/checkout') {
        this.router.navigate(['/home']);
      }
    } else {
      localStorage.setItem('orders_crowd', JSON.stringify(this.orders));
      this._appService.allOrders.next(this.orders);
    }
  }

  updateQuantity(event, mealIndex, action) {

    if (action === 'add') {
      if ((this.orders[mealIndex].max_quantity != 0 && this.orders[mealIndex].max_quantity > this.orders[mealIndex].order_quantity) || this.orders[mealIndex].max_quantity === 0) {
        this.orders[mealIndex].order_quantity = +this.orders[mealIndex].order_quantity + +this.orders[mealIndex].quantity_increase;
      }
    } else {
      if (this.orders[mealIndex].order_quantity > +this.orders[mealIndex].quantity_start) {
        this.orders[mealIndex].order_quantity = +this.orders[mealIndex].order_quantity - +this.orders[mealIndex].quantity_increase;
      }
    }
    localStorage.setItem('orders_crowd', JSON.stringify(this.orders));
    this._appService.allOrders.next(this.orders);
    // this.orders.forEach(item => {
    //     this.cost = 0;
    //     this.cost = this.cost + (item.price * item.order_quantity);
    //
    // });
  }

  checkAmount() {
    if (this._appService.minOrder > this.cost) {
      Swal.fire({
        title: this.translate.instant('_PleaseMakeSure') + this._appService.minOrder + this.translate.instant('_AEDHigher'),
        showClass: {
          popup: 'animated fadeInDown faster'
        },
        hideClass: {
          popup: 'animated fadeOutUp faster'
        }
      });
    } else {
      this._appService.showCart = !this._appService.showCart;
      if (this.isLogin) {
        this.router.navigate(['/checkout']);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }


  logout() {
    localStorage.removeItem('auth_token_CrowdMarket');
    localStorage.removeItem('orders_crowd');
    this.authService.signOut();
    window.location.reload();

  }

  getCategories() {
    this.restService.categories().then((res) => {
      if (res.code === 200) {
        this.categories = res.data;
      } else {
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  ngOnInit() {
    this.getCategories();
    this._appService.isUserLoggedIn.subscribe(value => {
      this.isLogin = value;
    });

    this._appService.name.subscribe(value => {
      if (value) {
        this.name = value;
      }
    });

    this.restService.notificationCount.subscribe(value => {
      if (value) {
        this.notificationCount = value;
      } else {
        this.notificationCount = 0;
      }
    });

    this._appService.allOrders.subscribe(result => {
      if (result.length) {
        this.orders = result;
        this.count = this.orders.length;
        this.cost = 0;
        this.orders.forEach(item => {
          this.cost = this.cost + (item.price * item.order_quantity);

        });
      } else {
        // this.router.navigate(['/home']);
        this.orders = [];
        this.count = 0;
      }
    });
  }


}
