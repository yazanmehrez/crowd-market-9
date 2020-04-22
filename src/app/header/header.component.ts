import {Component, OnInit} from '@angular/core';
import {AppService} from '../app.service';
import {Router} from '@angular/router';
import {DataService} from '../../services/data.service';
import {AuthService} from 'angularx-social-login';
import {HttpErrorResponse} from "@angular/common/http";
import {Category} from "../../models/category";

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
  isLogin: string;
  categories: Category[] = [];

  constructor(public _appService: AppService,
              public restService: DataService,
              private authService: AuthService,

              private router: Router) {
  }


  deleteOrder(product) {
    this.orders[0].products = this.orders[0].products.filter(item => item.product_id != product.product_id);
    if (this.orders[0].products.length == 0) {
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
      this.orders[0].products[mealIndex].order_quantity = this.orders[0].products[mealIndex].order_quantity + 1;

    } else {
      if (this.orders[0].products[mealIndex].order_quantity > 1) {
        this.orders[0].products[mealIndex].order_quantity = this.orders[0].products[mealIndex].order_quantity - 1;
      }
    }
    localStorage.setItem('orders_crowd', JSON.stringify(this.orders));
    this.orders.forEach(item => {
      this.cost = 0;
      item.products.forEach(meal => {
        this.cost = this.cost + (meal.price * meal.order_quantity);
      });
    });
  }


  logout() {
    localStorage.clear();
    localStorage.setItem('language', this._appService.currentLanguage);
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
    this._appService.allOrders.subscribe(result => {
      if (result.length) {
        this.orders = result;
        this.count = this.orders[0].products.length;
        this.orders.forEach(item => {
          this.cost = 0;
          item.products.forEach(meal => {
            this.cost = this.cost + (meal.price * meal.order_quantity);
          });
        });
      } else {
        // this.router.navigate(['/home']);
        this.orders = [];
        this.count = 0;
      }
    });
  }


}
