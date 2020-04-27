import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from '../app.service';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  active: number;
  banners = [{
    image: '/images/banner.png',
  }];
  constructor(
    private router: Router,
    public appService: AppService,
    private restService: DataService,) {
  }

  search(value) {
    if (value) {
      this.appService.keyword = value;
      this.router.navigate(['/products/0']);
    }
  }

  ngOnInit() {
    let href = this.router.url;
    if (href == '/account/profile') {
        this.appService.active = 1;
    } else if (href == '/account/address') {
      this.appService.active = 5;

    } else if (href == '/account/orders') {
      this.appService.active = 2;

    }else if (href == '/account/favourites') {
      this.appService.active = 3;

    }
  }
}
