import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {DataService} from '../../../services/data.service';
import {OrderModel} from '../../../models/order.model';
import {FilterModel} from '../../../models/filter.model';
import {MatDialog} from '@angular/material/dialog';
import {RateComponent} from '../../dialogs/rate/rate.component';
import {OrderDetailsComponent} from '../../dialogs/order-details/order-details.component';
import {AppService} from '../../app.service';
import {Order} from '../../../models/basket.model';

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
    newOrders: any[] = [];
    noData = false;


    constructor(private toastr: ToastrService,
                public restService: DataService,
                private appService: AppService,
                private dialog: MatDialog
    ) {
    }


    reOrder(order) {
        order.crowdmarket_sub_orders.forEach(item => {
            let product = new Order();
            product.farmer_id = item.farmer_id;
            product.product_id = item.product.product_id;
            product.product_name = item.product.name;
            product.order_quantity = item.quantity;
            product.price = item.product.price;
            product.image = item.product.image;
            product.quantity_increase = item.product.quantity_increase;
            product.quantity_start = item.product.quantity_start;
            this.newOrders.push(product);
            if (order.crowdmarket_sub_orders.length == this.newOrders.length) {
                localStorage.setItem('orders_crowd', JSON.stringify(this.newOrders));
                this.appService.allOrders.next(this.newOrders);

            }
        });
    }

    getOrders() {
        this.restService.getOrders(this.filter).then((res) => {
            if (res.code === 200) {
                this.orders = res.data.Orders;
                if (this.filter.page == 0) {
                    this.allOrders = res.data.Orders;
                    if(this.allOrders.length == 0){
                      this.noData = true;
                    }else{
                      this.noData = false;
                    }
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
        dialogRef.afterClosed().subscribe(result => {
            if (result == 200) {
                let index = this.allOrders.indexOf(item);
                this.allOrders[index].isRate = 1;
            }
        });
    }

    ngOnInit() {
      window.scroll(0 , 0);
        this.filter.page = 0;
        this.filter.sort_by = -1;
        this.getOrders();
    }

}
