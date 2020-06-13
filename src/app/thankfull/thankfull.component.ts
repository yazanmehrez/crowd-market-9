import {Component, OnInit} from '@angular/core';
import {AppService} from "../app.service";

@Component({
  selector: 'app-thankfull',
  templateUrl: './thankfull.component.html',
  styleUrls: ['./thankfull.component.scss']
})
export class THANKFULLComponent implements OnInit {

  constructor(private appService: AppService) {
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    localStorage.removeItem('orders_crowd');
    localStorage.removeItem('crowd-order-id');
    this.appService.allOrders.next([]);

  }

}
