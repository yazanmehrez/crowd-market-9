import {Component, HostListener} from '@angular/core';
import {AppService} from './app.service';
import {DataService} from '../services/data.service';
import * as $ from 'jquery';
import {MessagingService} from '../services/messaging.service';
import * as jwt_decode from 'jwt-decode';
import {HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'CrowdMarket';
    message;
    mobileQuery: MediaQueryList;

    constructor(public _appService: AppService,
                public restService: DataService,
                private router: Router,
                private messagingService: MessagingService,
    ) {

    }

    @HostListener('window:scroll', ['$event'])
    onWindowScroll($event) {
        $(window).scroll(function() {

            var scrollTop = $(window).scrollTop();

            if (scrollTop > 70) {
                $('.header').addClass('fix-header');
            } else {
                $('.header').removeClass('fix-header');
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

    ngOnInit() {
        this.getConstrains();
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

    }
}
