import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  active: number;

  constructor(
    private router: Router) {
  }

  ngOnInit() {
    let href = this.router.url;
    if (href == '/account/profile') {
        this.active = 1;
    } else if (href == '/account/address') {
      this.active = 5;

    } else if (href == '/account/orders') {
      this.active = 2;

    }else if (href == '/account/favourites') {
      this.active = 3;

    }
  }
}
