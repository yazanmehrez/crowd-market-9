import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable, NgZone} from '@angular/core';
import {ApiService} from './api.service';
import {environment} from '../environments/environment';
import {AppService} from '../app/app.service';
import {UserModel} from '../models/user.model';
import {PaginationModel} from '../models/pagination.model';
import {FilterModel} from '../models/filter.model';
import {AddressModel} from '../models/address.model';
import {AccountModel} from '../models/Account.model';
import {ToastrService} from 'ngx-toastr';
import {BasketModel, Order} from '../models/basket.model';
import Swal from 'sweetalert2';
import {RateModel} from '../models/rate.Model';
import {OrderModel} from '../models/order.model';
import {NotificationModel} from '../models/notification.model';
import {BehaviorSubject} from 'rxjs';
import {SocialUser} from 'angularx-social-login';
import {ServiceProvider} from '../models/ServiceProvider';
import {FavouriteModel, ProductModel} from '../models/product.model';
import {MatDialog} from '@angular/material/dialog';
import {ContactModel} from '../models/category';


@Injectable({
  providedIn: 'root'
})
export class DataService extends ApiService {
  baseUrl = '';
  progressCount = 0;
  data: any[];
  quantity: number;
  products: ProductModel[] = [];
  allOrders: any[] = [];
  order_products: any[] = [];
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
    return this.restRequest(null, `${this.baseUrl}/CrowdMarket/home`, null, 'GET');
  }

  categories() {
    return this.restRequest(null, `${this.baseUrl}/category/get`, null, 'GET');
  }

  getBanners() {
    return this.restRequest(null, `${this.baseUrl}/banner/get`, null, 'GET');
  }


   constrain() {
    return this.restRequest(null, `${this.baseUrl}/CrowdMarket/constrains`, null, 'GET');
  }

  getFarmerDetails(model: FilterModel) {
    return this.restRequest(null, `${this.baseUrl}/Farmer/reviews/${model.farmer_id}/${model.page}`, null, 'GET');
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

  getAllFarmers() {
    return this.restRequest(null, `${this.baseUrl}/Farmer/get`, null, 'GET');
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

  getFarmers(model: FilterModel, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/Farmer/filter`, null, type);
  }


  createSPAccount(model: ServiceProvider, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/user/sp/register`, null, type);
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

  complain(model: ContactModel, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/contact/admin/create`, null, type);
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


  resetPassword(model: UserModel, type: string = 'PUT') {
    return this.restRequest(model, `${this.baseUrl}/authenticate/reset_password`, null, type);
  }


  filterProducts(model: FilterModel, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/Products/filter`, null, type);
  }

  uploadFile(formdata: PaginationModel, type: string = 'POST') {
    return this.restRequest(formdata, `${this.baseUrl}/upload/base64`, null, type);
  }

  uploadTextFile(formdata: FormData, type: string = 'POST') {
    return this.restRequest(null, `${this.baseUrl}/upload/base64/file`, null, type, false, formdata);
  }


  deleteAddress(id, type: string = 'DELETE') {
    return this.restRequest(null, `${this.baseUrl}/address/delete/${id}`, null, type, false);
  }

  addToCart(data: ProductModel) {
    this.allOrders = localStorage.getItem('orders_crowd') ? JSON.parse(localStorage.getItem('orders_crowd')) : [];
    if (!data.order_quantity) {
      data.order_quantity = 1;
    }
    let order = new BasketModel();
    let product = new Order();
    if (data.discount === 1) {
      product.price = data.new_price;

    } else {
      product.price = data.price;

    }
    product.product_id = data.product_id;
    product.product_name = data.name;
    product.quantity = data.quantity + '/' + data.Unit.name;
    product.image = data.image.toString();
    product.order_quantity = data.order_quantity;
    // product.delivery_charges = data.is_delivery ? 0 : 5;
    let item = this.allOrders.filter(item => item.farmer_id === data.Farmer.farmer_id);
    if (item.length > 0) {
      let index = this.allOrders.indexOf(item[0]);
      let findProduct = this.allOrders[index].products.filter(item => item.product_id == data.product_id);
      let productIndex = this.allOrders[index].products.indexOf(findProduct[0]);
      if (productIndex >= 0) {
        this.allOrders[index].products[productIndex].order_quantity = +data.order_quantity + +this.allOrders[index].products[productIndex].order_quantity;
      } else {
        this.allOrders[index].products.push(product);
      }
      localStorage.setItem('orders_crowd', JSON.stringify(this.allOrders));
      this.appService.allOrders.next(this.allOrders);
    } else if (this.allOrders.length == 0) {
      order.farmer_id = data.Farmer.farmer_id;
      order.farmer_name = data.Farmer.title;
      this.order_products.push(product);
      order.products = this.order_products;
      this.allOrders.push(order);
      localStorage.setItem('orders_crowd', JSON.stringify(this.allOrders));
      this.appService.allOrders.next(this.allOrders);
    } else {
      this.clearCartConfirm(data, product);
    }


  }

  clearCartConfirm(data: any, meal) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'There are meals in your cart from ' + data.Farmer.name + ' kitchen .\n' +
        'Do you want to clear your cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, clear it!',
      cancelButtonText: 'No, keep it'
    })
      .then(result => {
        if (result.value) {
          this.allOrders = [];
          this.order_products = [];
          let order = new BasketModel();
          order.farmer_id = data.Farmer.farmer_id;
          order.farmer_name = data.Farmer.title;
          this.order_products.push(meal);
          order.products = this.order_products;
          this.allOrders.push(order);
          localStorage.setItem('orders_crowd', JSON.stringify(this.allOrders));
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
          this.notificationCount.subscribe(value => {
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
