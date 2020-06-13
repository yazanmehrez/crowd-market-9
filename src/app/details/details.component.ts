import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FavouriteModel, ProductModel} from "../../models/product.model";
import {DataService} from "../../services/data.service";
import {AppService} from "../app.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
details: ProductModel;
  constructor(public restService: DataService,
              public appService: AppService,
              private toastr: ToastrService) {

  }



  ngOnInit(): void {

    this.appService.productDetails.subscribe(value =>{
      if(value){
        this.details = value;
      }
    });
  }

  favourite(product: ProductModel) {
    let model = new FavouriteModel();
    if (product.favourite) {
      model.status = 0;
    } else {
      model.status = 1;
    }
    model.product_id = product.product_id;
    this.restService.addFavourite(model).then((res) => {
      if (res.code === 200) {
        if (model.status === 1) {
          this.details.favourite = res.data;
        } else {
          this.details.favourite = null;
        }
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }


  updateQuantity(action, value) {
    if (action === 'minus') {
      if (this.details.order_quantity > +this.details.quantity_start) {
        this.details.order_quantity = this.details.order_quantity - +this.details.quantity_increase;
      }
    } else if (action === 'add') {
      if (this.details.order_quantity > 0) {
        this.details.order_quantity = +this.details.order_quantity + +this.details.quantity_increase;
      } else {
        this.details.order_quantity =  +this.details.quantity_start;
      }
    } else {
      if (value >= 1) {
        this.details.order_quantity = value;
      }
    }
  }

}
