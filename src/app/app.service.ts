import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {PaginationModel} from '../models/pagination.model';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  // public  email =  /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  public email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  public language = new BehaviorSubject<string>(null);
  public isUserLoggedIn: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public isActive: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  public countOrder: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  allOrders: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  photo: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  photoSocial: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  active = 0;
  location = new PaginationModel();
  public loading = false;
  currentLanguage: string;
  orders: any[] = [];

  constructor(private translate: TranslateService) {
    /** Language Configurations **/
    if (!localStorage.getItem('language')) {
      localStorage.setItem('language', 'en');
    }
    const browserLang = localStorage.getItem('language');
    translate.setDefaultLang(browserLang.match(/en|ar/) ? browserLang : 'en');
    this.language.next(browserLang);
    this.currentLanguage = browserLang;


    const token = localStorage.getItem('auth_token_aklbetna') ? localStorage.getItem('auth_token_aklbetna') : '';
    this.isUserLoggedIn.next(token);

    const photo = localStorage.getItem('photo') ? localStorage.getItem('photo') : '';
    const photoSocial = localStorage.getItem('photoSocial') ? localStorage.getItem('photoSocial') : '';
    this.photo.next(photo);
    this.photoSocial.next(photoSocial);
    this.orders = localStorage.getItem('orders') ? JSON.parse(localStorage.getItem('orders')) : [];
    this.countOrder.next(this.orders.length);
    this.allOrders.next(this.orders);
  }


  /* Switch Language */
  switchLanguage(language: string) {
    localStorage.setItem('language', language);
    location.reload();
    setTimeout(() => {
      this.translate.use(language);
      this.language.next(language);
      this.currentLanguage = language;
    }, 2000);


  }


}
