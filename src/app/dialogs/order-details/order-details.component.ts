import {Component, OnInit} from '@angular/core';
import {OrderModel} from '../../../models/order.model';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  data: OrderModel;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
  }

}
