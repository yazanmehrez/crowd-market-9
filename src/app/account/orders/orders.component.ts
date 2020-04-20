import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {DataService} from '../../../services/data.service';
import {OrderModel} from '../../../models/order.model';
import {FilterModel} from '../../../models/filter.model';
import {MatDialog} from '@angular/material/dialog';
import {RateComponent} from '../../dialogs/rate/rate.component';
import {OrderDetailsComponent} from "../../dialogs/order-details/order-details.component";

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
    orders: OrderModel[] = [];
    allOrders: OrderModel[] = [];
    page = 0;
    filter = new FilterModel();

    constructor(private toastr: ToastrService,
                public restService: DataService,
                private dialog: MatDialog
    ) {
    }


    getOrders() {
        this.restService.getOrders(this.filter).then((res) => {
            if (res.code === 200) {
                this.orders = res.data.Orders;
                if (this.filter.page == 0) {
                    this.allOrders = res.data.Orders;
                } else {
                    this.orders.forEach(item => {
                        this.allOrders.push(item);
                    });
                }
            } else {
                this.toastr.error(res.message, '');
            }
        }).catch((err: HttpErrorResponse) => {
        });
    }

    openDetailsDialog(item) {
        let dialogRef = this.dialog.open(OrderDetailsComponent);
        dialogRef.componentInstance.data = item;
    }

    openRateDialog(item) {
        let dialogRef = this.dialog.open(RateComponent, {maxWidth: '100% !important'});
        dialogRef.componentInstance.data = item;
    }

    ngOnInit() {
        this.filter.page = 0;
        this.filter.sort_by = -1;
        this.getOrders();
    }

}
