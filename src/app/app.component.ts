import {Component, HostListener} from '@angular/core';
import {AppService} from './app.service';
import {DataService} from '../services/data.service';
import * as $ from 'jquery';
import {MessagingService} from '../services/messaging.service';
import * as jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Aklbetna';
  message;

  constructor(public _appService: AppService,
              public restService: DataService,
              private messagingService: MessagingService

  ) {

  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    $(window).scroll(function() {

      var scrollTop = $(window).scrollTop();

      if (scrollTop > 75) {
        $('nav').addClass('st-navbar-desktop-fixed');

      } else {
        $('nav').removeClass('st-navbar-desktop-fixed');

      }
    });
  }
  ngOnInit() {
    this.messagingService.requestPermission();
    this.messagingService.receiveMessage();
    this.message = this.messagingService.currentMessage;
    let decoded = localStorage.getItem('auth_token_aklbetna') ? jwt_decode(localStorage.getItem('auth_token_aklbetna')) : '';
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

  }
}
