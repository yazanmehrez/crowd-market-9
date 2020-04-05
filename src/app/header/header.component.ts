import {Component, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {Appearance} from '@angular-material-extensions/google-maps-autocomplete';
import {AppService} from '../app.service';
import {JwtHelperService} from '@auth0/angular-jwt';
import {ActivatedRoute, Router} from '@angular/router';
import {log} from 'util';
import {AuthService} from 'angularx-social-login';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  active = 0;
  open = false;
  decodedToken = true;
  public appearance = Appearance;
  public zoom: number;
  public latitude: number;
  public longitude: number;
  public location: string;
  public photo: string;
  isLogin: string;
  orders: any[] = [];
  cost = 0;
  email: string;

  constructor(public restService: DataService,
              public appService: AppService,
              private router: Router,
              private authService: AuthService,
              private routerActivate: ActivatedRoute,
              private jwtHelper: JwtHelperService) {
  }


  deleteOrder(meal) {
    this.orders[0].meals = this.orders[0].meals.filter(item => item.meal_id != meal.meal_id);
    if (this.orders[0].meals.length == 0) {
      localStorage.setItem('orders', '');
      this.orders = [];
      this.appService.allOrders.next(this.orders);
      this.cost = 0;
      if (this.router.url === '/checkout') {
        this.router.navigate(['/home']);
      }
    } else {
      localStorage.setItem('orders', JSON.stringify(this.orders));
      this.appService.allOrders.next(this.orders);
    }
  }

  updateQuantity(event, mealIndex) {
    this.orders[0].meals[mealIndex].quantity = event.value;
    localStorage.setItem('orders', JSON.stringify(this.orders));
    this.orders.forEach(item => {
      this.cost = 0;
      item.meals.forEach(meal => {
        this.cost = this.cost + (meal.price * meal.quantity);
      });
    });

  }

  logout() {
    localStorage.clear();
    localStorage.setItem('language', this.appService.currentLanguage);
    this.authService.signOut();
    window.location.reload();

  }

  ngOnInit() {
    this.appService.photo.subscribe(value => {
      if (value ) {
        this.photo = this.restService.baseUrl + value;
      }else{
        this.appService.photoSocial.subscribe(image => {
          if (image) {
            this.photo = image;
            console.log(this.photo);
          }
        });
      }
    });

    this.appService.isUserLoggedIn.subscribe(value => {
      if (value) {
        this.isLogin = localStorage.getItem('auth_token_aklbetna') ? this.jwtHelper.decodeToken(localStorage.getItem('auth_token_aklbetna')).email : '';
      }
    });


    this.appService.allOrders.subscribe(result => {
      if (result.length) {
        this.orders = result;
        this.orders.forEach(item => {
          this.cost = 0;
          item.meals.forEach(meal => {
            this.cost = this.cost + (meal.price * meal.quantity);
          });
        });
      } else {
        this.router.navigate(['/home']);
      }
    });
  }

}
