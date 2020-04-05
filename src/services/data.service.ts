import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable, NgZone} from '@angular/core';
import {ApiService} from './api.service';
import {environment} from '../environments/environment';
import {AppService} from '../app/app.service';
import {DeliveryDetailsComponent} from '../app/dialogs/delivery-details/delivery-details.component';
import {MatDialog} from '@angular/material';
import {UserModel} from '../models/user.model';
import {PaginationModel} from '../models/pagination.model';
import {FilterModel} from '../models/filter.model';
import {FavouriteModel, MealModel} from '../models/meal.model';
import {AddressModel} from '../models/address.model';
import {AccountModel} from '../models/Account.model';
import {ToastrService} from 'ngx-toastr';
import {BasketModel, Meal} from '../models/basket.model';
import Swal from 'sweetalert2';
import {RateModel} from '../models/rate.Model';
import {OfferModel} from '../models/offer.model';
import {OrderModel} from '../models/order.model';
import {NotificationModel} from '../models/notification.model';
import {BehaviorSubject} from 'rxjs';
import {SocialUser} from 'angularx-social-login';
import {ServiceProvider} from '../models/ServiceProvider';


@Injectable({
  providedIn: 'root'
})
export class DataService extends ApiService {
  baseUrl = '';
  progressCount = 0;
  data: any[];
  quantity: number;
  Meals: MealModel[] = [];
  allOrders: any[] = [];
  meals: any[] = [];
  notifyCount = 0;

  notifications: NotificationModel[] = [];
  allNotifications: NotificationModel[] = [];
  public notificationCount: BehaviorSubject<number> = new BehaviorSubject<number>(null);


  constructor(public httpClient: HttpClient,
              private ngZone: NgZone,
              private dialog: MatDialog,
              private appService: AppService,
              private toastr: ToastrService
  ) {
    super(httpClient);

    this.baseUrl = environment.baseUrl;
    this.currentProgress.subscribe((progress: string) => {
      this.ngZone.run(() => {
        this.progressCount = Number(progress);
      });
    });
  }

  home() {
    return this.restRequest(null, `${this.baseUrl}/alkabetna/home`, null, 'GET');
  }

  categories() {
    return this.restRequest(null, `${this.baseUrl}/category/get`, null, 'GET');
  }

  getTypes() {
    return this.restRequest(null, `${this.baseUrl}/type/get`, null, 'GET');
  }

  getCategories() {
    return this.restRequest(null, `${this.baseUrl}/category/admin/get`, null, 'GET');
  }

  getOrders(filter: FilterModel) {
    return this.restRequest(null, `${this.baseUrl}/order/get/${filter.page}/${filter.sort_by}`, null, 'GET');
  }

  relatedMeals(id) {
    return this.restRequest(null, `${this.baseUrl}/meals/get/related/${id}`, null, 'GET');
  }

  mealDetails(id) {
    return this.restRequest(null, `${this.baseUrl}/meals/get/${id}`, null, 'GET');
  }

  kitchensDetails(id) {
    return this.restRequest(null, `${this.baseUrl}/kitchen/get/${id}`, null, 'GET');
  }

  featuredMeals(model: PaginationModel) {
    return this.restRequest(null, `${this.baseUrl}/meals/get/featured/${model.page}/${model.size}/1`, null, 'GET');
  }

  getFavourites(model: PaginationModel) {
    return this.restRequest(null, `${this.baseUrl}/favourite/get/${model.page}`, null, 'GET');
  }

  getAddress() {
    return this.restRequest(null, `${this.baseUrl}/address/get`, null, 'GET');
  }

  getCities() {
    return this.restRequest(null, `${this.baseUrl}/city/get`, null, 'GET');
  }




  getAccounts() {
    return this.restRequest(null, `${this.baseUrl}/account/get`, null, 'GET');
  }




  resendCode(model: UserModel, type: string = 'PUT') {
    return this.restRequest(model, `${this.baseUrl}/authenticate/sent_otp_by_email`, null, type);
  }


  kitchens(model: PaginationModel, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/category/get/${model.id}/${model.page}`, null, type);
  }

   createSPAccount(model: ServiceProvider, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/kitchen/createWithSP`, null, type);
  }

  getKitchensByLocation(model: PaginationModel, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/kitchen/getByLocation`, null, type);
  }

  // getNotificationsUser(page) {
  //   return this.restRequest(null, `${this.baseUrl}/notifications/users/get/${page}`, null, 'GET');
  // }
  getNotificationsUser(page) {
    return this.restRequest(null, `${this.baseUrl}/notifications/admin/get/${page}`, null, 'GET');
  }

  offers(model: FilterModel, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/offers/get`, null, type);
  }


  addRate(model: RateModel, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/order/leavereivew`, null, type);
  }

  //
  // sendRequset(model: RequestModel, type: string = 'POST') {
  //   return this.restRequest(model, `${this.baseUrl}/requests/admin/create`, null, type);
  // }
  //
  addAccount(model: AccountModel, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/account/create`, null, type);
  }

  login(model: UserModel, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/authenticate/login`, null, type);
  }

  addAddress(model: AddressModel, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/address/create`, null, type);
  }


  editProfile(model: UserModel, type: string = 'PUT') {
    return this.restRequest(model, `${this.baseUrl}/user/edit_profile`, null, type);
  }

  getProfile() {
    return this.restRequest(null, `${this.baseUrl}/user/profile`, null, 'GET');
  }

  register(model: UserModel, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/authenticate/register`, null, type);
  }

  register_social(model: SocialUser, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/authenticate/social`, null, type);
  }

  addFavourite(model: FavouriteModel, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/favourite/status`, null, type);
  }

  createOrder(model: OrderModel, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/order/create`, null, type);
  }


  verification(model: UserModel, type: string = 'PUT') {
    return this.restRequest(model, `${this.baseUrl}/authenticate/activate`, null, type);
  }

  updateUserNotification(model: NotificationModel, type: string = 'PUT') {
    return this.restRequest(model, `${this.baseUrl}/notifications/users/read/${model.notification_id}`, null, type);
  }


  resetPassword(model: UserModel, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/authenticate/reset_password`, null, type);
  }


  filterMeals(model: FilterModel, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/meals/filter`, null, type);
  }

  uploadFile(formdata: PaginationModel, type: string = 'POST') {
    return this.restRequest(formdata, `${this.baseUrl}/upload/base64`, null, type);
  }

  uploadTextFile(formdata: FormData, type: string = 'POST') {
    return this.restRequest(null, `${this.baseUrl}/upload/base64/file`, null, type, false, formdata);
  }

  editBankAccount(model: AccountModel, type: string = 'PUT') {
    return this.restRequest(model, `${this.baseUrl}/account/update`, null, type);
  }

  deleteBankAccount(id, type: string = 'DELETE') {
    return this.restRequest(null, `${this.baseUrl}/account/delete/${id}`, null, type, false);
  }



  favourite(meal: MealModel) {
    let model = new FavouriteModel();
    if (meal.Favourite) {
      model.meal_id = meal.meal_id;
      model.status = 0;
    } else {
      model.meal_id = meal.meal_id;
      model.status = 1;
    }
    this.addFavourite(model).then((res) => {
      if (res.code === 200) {
        if (model.status == 0) {
          meal.Favourite = null;
        } else {
          meal.Favourite = res.data;
        }
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  decreaseQuantity(item: MealModel) {
    if (item.quantity > 1) {
      let index = this.Meals.indexOf(item);
      this.Meals[index].quantity = item.quantity - 1;
    }
  }

  updateQuantity(item: MealModel, value) {
    let index = this.Meals.indexOf(item);
    this.Meals[index].quantity = value;
    console.log(this.Meals[index].quantity);

  }


  increaseQuantity(item: MealModel) {
    let index = this.Meals.indexOf(item);
    if (item.quantity > 0) {
      this.Meals[index].quantity = +item.quantity + 1;
    } else {
      this.Meals[index].quantity = 1;

    }
  }


  addOfferToCart(data: OfferModel) {
    this.allOrders = localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : [];
    if (!data.quantity) {
      data.quantity = 1;
    }

    let order = new BasketModel();
    let meal = new Meal();
    meal.price = data.price;
    meal.offer_id = data.offer_id;
    meal.meal_name = data.title;
    meal.quantity = data.quantity;
    meal.delivery_charges = data.is_delivery ? 0 : 5;
    let item = this.allOrders.filter(item => item.kitchen_id == data.Kitchen.kitchen_id);
    if (item.length > 0) {
      let index = this.allOrders.indexOf(item[0]);
      let findMeal = this.allOrders[index].meals.filter(item => item.meal_id == data.offer_id);
      let mealIndex = this.allOrders[index].meals.indexOf(findMeal[0]);
      if (mealIndex >= 0) {
        this.allOrders[index].meals[mealIndex].quantity = +data.quantity + +this.allOrders[index].meals[mealIndex].quantity;
      } else {
        this.allOrders[index].meals.push(meal);
      }
      localStorage.setItem('orders', JSON.stringify(this.allOrders));
      this.appService.allOrders.next(this.allOrders);
    } else if (this.allOrders.length == 0) {
      order.kitchen_id = data.Kitchen.kitchen_id;
      order.kitchen_name = data.Kitchen.name;
      this.meals.push(meal);
      order.meals = this.meals;
      this.allOrders.push(order);
      localStorage.setItem('orders', JSON.stringify(this.allOrders));
      this.appService.allOrders.next(this.allOrders);
    } else {
      this.clearCartConfirm(data, meal);
    }

  }

  addToCart(data: any) {
    console.log(data);
    this.allOrders = localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : [];
    if (!data.quantity) {
      data.quantity = 1;
    }
    let order = new BasketModel();
    let meal = new Meal();
    meal.price = data.price;
    meal.meal_id = data.meal_id ? data.meal_id : '';
    meal.offer_id = data.offer_id ? data.offer_id : '';
    meal.meal_name = data.name ? data.name : data.title;
    meal.quantity = data.quantity;
    meal.delivery_charges = data.is_delivery ? 0 : 5;
    let item = this.allOrders.filter(item => item.kitchen_id == data.Kitchen.kitchen_id);
    if (item.length > 0) {
      let index = this.allOrders.indexOf(item[0]);
      let findMeal = this.allOrders[index].meals.filter(item => item.meal_id == data.meal_id);
      let mealIndex = this.allOrders[index].meals.indexOf(findMeal[0]);
      if (mealIndex >= 0) {
        this.allOrders[index].meals[mealIndex].quantity = +data.quantity + +this.allOrders[index].meals[mealIndex].quantity;
      } else {
        this.allOrders[index].meals.push(meal);
      }
      localStorage.setItem('orders', JSON.stringify(this.allOrders));
      this.appService.allOrders.next(this.allOrders);
    } else if (this.allOrders.length == 0) {
      order.kitchen_id = data.Kitchen.kitchen_id;
      order.kitchen_name = data.Kitchen.name;
      this.meals.push(meal);
      order.meals = this.meals;
      this.allOrders.push(order);
      localStorage.setItem('orders', JSON.stringify(this.allOrders));
      this.appService.allOrders.next(this.allOrders);
    } else {
      this.clearCartConfirm(data, meal);
    }


  }

  clearCartConfirm(data: any, meal) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'There are meals in your cart from ' + data.Kitchen.name + ' kitchen .\n' +
        'Do you want to clear your cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, clear it!',
      cancelButtonText: 'No, keep it'
    })
      .then(result => {
        if (result.value) {
          this.allOrders = [];
          this.meals = [];
          let order = new BasketModel();
          order.kitchen_id = data.Kitchen.kitchen_id;
          order.kitchen_name = data.Kitchen.name;
          this.meals.push(meal);
          order.meals = this.meals;
          this.allOrders.push(order);
          localStorage.setItem('orders', JSON.stringify(this.allOrders));
          this.appService.allOrders.next(this.allOrders);
        }
      });
  }


  getNotifications(page) {
    this.getNotificationsUser(page).then((res) => {
      if (res.code === 200) {
        this.notifications = res.data.notifications;
        if (page == 0) {
          this.allNotifications = res.data.notifications;
        } else {
          this.notifications.forEach(item => {
            this.allNotifications.push(item);
          });
        }
        this.notifyCount = res.data.unread;
        this.notificationCount.next(this.notifyCount);
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {

    });
  }


  updateNotification(data: NotificationModel) {
    if (data.read == 0) {
      data.read = 1;
        this.updateUserNotification(data).then((res) => {
          if (res.code === 200) {
            this.notificationCount.subscribe(value =>{
              this.notificationCount.next(value - 1);
            });
          } else {
            this.toastr.error(res.message, '');
          }
        }).catch((err: HttpErrorResponse) => {

        });
      }
    }


}
