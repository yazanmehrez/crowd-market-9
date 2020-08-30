import {Component, isDevMode, OnInit} from '@angular/core';
import {AppService} from './app.service';
import {DataService} from '../services/data.service';
import {MessagingService} from '../services/messaging.service';
import * as jwt_decode from 'jwt-decode';
import {HttpErrorResponse} from '@angular/common/http';
import {NavigationEnd, Router} from '@angular/router';
import {FuseSplashScreenService} from "../services/fuse-splash-screen.service";
import {WelcomeComponent} from "./dialogs/welcome/welcome.component";
import {MatDialog} from "@angular/material/dialog";
import {Platform} from "@angular/cdk/platform";

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  hideFooterHeader = false;
  title = 'CrowdMarket';
  message;
  mobileQuery: MediaQueryList;
  notFixedList = ['/register', '/login', '/reset-password', '/forget-password', '/verification'];
  isAndroid = false;
  isIOS = false;

  constructor(public _appService: AppService,
              public restService: DataService,
              private router: Router,
              private dialog: MatDialog,
              private messagingService: MessagingService,
              private platform: Platform,
              private _fuseSplashScreenService: FuseSplashScreenService,
  ) {

    this.isAndroid = this.platform.ANDROID;
    this.isIOS = this.platform.IOS;

    if (this.isAndroid === true) {
      let dialogRef = this.dialog.open(WelcomeComponent);
      dialogRef.componentInstance.data = 'android';

    } else if (this.isIOS === true) {
      let dialogRef = this.dialog.open(WelcomeComponent);
      dialogRef.componentInstance.data = 'ios';

    } else {
      let dialogRef = this.dialog.open(WelcomeComponent);
      dialogRef.componentInstance.data = 'web';

    }
    // Google Analytics - For Live
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        if (!isDevMode()) {
          gtag('config', 'UA-169338543-1',
            {
              'page_path': event.urlAfterRedirects
            }
          );
          gtag('js', new Date());
        }
      }
    });
    window.addEventListener('scroll', () => {
      if (!this.hideFooterHeader) {
        const distanceTop = window.pageYOffset;
        if (!this.notFixedList.includes(this.router.url)) {
          if (distanceTop > 70) {
            document.getElementsByClassName('header')[0].classList.add('fix-header');
          }
          if (distanceTop === 0) {
            document.getElementsByClassName('header')[0].classList.remove('fix-header');
          }
        } else {
          document.getElementsByClassName('header')[0].classList.remove('fix-header');
        }
      }
    });
  }

  getConstrains() {
    this.restService.constrain().then((res) => {
      if (res.code === 200) {

        this._appService.minOrder = res.data.constrains.minOrder;
        this._appService.shipping = res.data.constrains.shippingCost;

      } else {
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  switchToHTTPS() {
    if (window.location.protocol === 'http:') {
      window.location.href = location.href.replace('http', 'https');
    }
  }

  ngOnInit() {
    // this.switchToHTTPS();
    this.getConstrains();
    this._fuseSplashScreenService.show();
    setTimeout(() => {
      this._fuseSplashScreenService.hide();
    }, 10000);
    this.messagingService.requestPermission();
    this.messagingService.receiveMessage();
    this.message = this.messagingService.currentMessage;
    let decoded = localStorage.getItem('auth_token_CrowdMarket') ? jwt_decode(localStorage.getItem('auth_token_CrowdMarket')) : '';
    if (decoded.email) {
      this.restService.getNotifications(0);
    }


    this._appService.language.subscribe(language => {
      this._appService.currentLanguage = language === 'en' ? 'en' : 'ar';
      switch (language) {
        case 'en':
          document.documentElement.setAttribute('lang', 'en');
          break;
        case 'ar':
          document.documentElement.setAttribute('lang', 'ar');
      }
    });

    this._appService.footerHeader$.subscribe((value: boolean) => {
      this.hideFooterHeader = value;
    });

  }
}
