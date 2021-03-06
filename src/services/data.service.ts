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
import {OrderGuestGModel, OrderModel} from '../models/order.model';
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

  deals() {
    return this.restRequest(null, `${this.baseUrl}/deals/get`, null, 'GET');
  }

  getTypes() {
    return this.restRequest(null, `${this.baseUrl}/type/get`, null, 'GET');
  }


  getBanners() {
    return this.restRequest(null, `${this.baseUrl}/banner/get`, null, 'GET');
  }

  getTermsPolicy(id) {
    return this.restRequest(null, `${this.baseUrl}/CrowdMarket/about/${id}`, null, 'GET');
  }


  constrain() {
    return this.restRequest(null, `${this.baseUrl}/CrowdMarket/constrains`, null, 'GET');
  }

  getFarmerDetails(model: FilterModel) {
    return this.restRequest(null, `${this.baseUrl}/Farmer/reviews/${model.farmer_id}/${model.page}`, null, 'GET');
  }

  getProductByID(id) {
    return this.restRequest(null, `${this.baseUrl}/products/get/${id}`, null, 'GET');
  }


  getOrders(filter: FilterModel) {
    return this.restRequest(null, `${this.baseUrl}/order/get/${filter.page}/${filter.sort_by}`, null, 'GET');
  }

  updateFCM(model: PaginationModel, type: string = 'PUT') {
    return this.restRequest(model, `${this.baseUrl}/user/fcm`, null, type);
  }

  updatePayment(model: PaginationModel, type: string = 'PUT') {
    return this.restRequest(model, `${this.baseUrl}/order/update/paymentstatus`, null, type);
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


  getFarmers(model: FilterModel, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/Farmer/filter`, null, type);
  }

  subscribe(model: FilterModel, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/subscribe/create`, null, type);
  }


  createSPAccount(model: ServiceProvider, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/user/sp/register`, null, type);
  }


  // getNotificationsUser(page) {
  //   return this.restRequest(null, `${this.baseUrl}/notifications/users/get/${page}`, null, 'GET');
  // }


  getNotificationsUser(page) {
    return this.restRequest(null, `${this.baseUrl}/notifications/users/get/${page}`, null, 'GET');
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

  editAddress(model: AddressModel, type: string = 'PUT') {
    return this.restRequest(model, `${this.baseUrl}/address/update`, null, type);
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

  registerGuest(model: OrderGuestGModel, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/address/GuestCreate`, null, type);
  }

  register_social(model: SocialUser, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/authenticate/social`, null, type);
  }

  complain(model: ContactModel, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/contact/create`, null, type);
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

  checkCoupon(model: FilterModel, type: string = 'POST') {
    return this.restRequest(model, `${this.baseUrl}/coupons/verify`, null, type);
  }


  uploadTextFile(formdata: FormData, type: string = 'POST') {
    return this.restRequest(null, `${this.baseUrl}/upload/base64/file`, null, type, false, formdata);
  }

  uploadVideo(formdata: FormData, type: string = 'POST') {
    return this.restRequest(null, `${this.baseUrl}/upload/mp4`, null, type, false, formdata);
  }

  deleteAddress(id, type: string = 'DELETE') {
    return this.restRequest(null, `${this.baseUrl}/address/delete/${id}`, null, type, false);
  }

  addToCart(data: ProductModel) {
    console.log(data);

    this.allOrders = localStorage.getItem('orders_crowd') ? JSON.parse(localStorage.getItem('orders_crowd')) : [];
    let product = new Order();
    if (data.discount === 1) {
      product.price = data.new_price;
    } else {
      product.price = data.price;
    }
    product.farmer_id = data.farmer.farmer_id;
    product.product_id = data.product_id;
    product.product_name = data.name;
    product.quantity_start = data.quantity_start;
    product.quantity_increase = data.quantity_increase;
    product.max_quantity = data.max_quantity;
    product.quantity = data.quantity + '/' + data.unit.name;
    product.image = data.image.toString();
    product.order_quantity = data.order_quantity ? data.order_quantity : data.quantity_start;
    data.order_quantity = data.quantity_start;

    let item = this.allOrders.filter(item => item.product_id === data.product_id);
    if (item.length > 0) {
      let index = this.allOrders.indexOf(item[0]);
      if (index >= 0) {
        if(data.max_quantity > 0 && +data.order_quantity + +this.allOrders[index].order_quantity <= data.max_quantity){
          this.allOrders[index].order_quantity = +data.order_quantity + +this.allOrders[index].order_quantity;
        }else if(data.max_quantity === 0 ){
          this.allOrders[index].order_quantity = +data.order_quantity + +this.allOrders[index].order_quantity;

        }
      } else {
        this.allOrders[index].push(product);
      }
      localStorage.setItem('orders_crowd', JSON.stringify(this.allOrders));
      this.appService.allOrders.next(this.allOrders);
    } else {

      this.allOrders.push(product);
      localStorage.setItem('orders_crowd', JSON.stringify(this.allOrders));
      this.appService.allOrders.next(this.allOrders);
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
    let count: number;
    if (data.read == 0) {
      data.read = 1;
      this.notificationCount.subscribe(value => {
        count = value;
      });
      this.updateUserNotification(data).then((res) => {
        if (res.code === 200) {
          this.notificationCount.next(count - 1);
        } else {
          this.toastr.error(res.message, '');
        }
      }).catch((err: HttpErrorResponse) => {

      });
    }
  }


}
