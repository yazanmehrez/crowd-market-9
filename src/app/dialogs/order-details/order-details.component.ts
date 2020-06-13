import {Component, OnInit} from '@angular/core';
import {OrderModel} from '../../../models/order.model';
import {MatDialog} from '@angular/material/dialog';
import {AppService} from "../../app.service";

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  data: OrderModel;
  lang: string;

  constructor(public dialog: MatDialog ,
              private appService: AppService) {
  }

  ngOnInit() {
    this.lang = this.appService.currentLanguage === 'en' ? 'ltr' : 'rtl';

  }

}
