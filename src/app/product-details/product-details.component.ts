import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {DataService} from "../../services/data.service";
import {ToastrService} from "ngx-toastr";
import {AppService} from "../app.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {FavouriteModel, ProductModel} from "../../models/product.model";
import {FuseSplashScreenService} from "../../services/fuse-splash-screen.service";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  details: ProductModel;
  id: number;
  constructor(public restService: DataService,
              private toastr: ToastrService,
              public appService: AppService,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog,
              private router: Router,
              private _fuseSplashScreenService: FuseSplashScreenService,

  ) {

  }


  getProductDetails() {
    this.restService.getProductByID(this.id).then((res) => {
      if (res.code === 200) {
        this.details = res.data;
        this._fuseSplashScreenService.hide();

      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
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
        if (this.details.max_quantity > 0 && +this.details.max_quantity >= +this.details.order_quantity + +this.details.quantity_increase) {
          this.details.order_quantity = +this.details.order_quantity + +this.details.quantity_increase;
        } else if (+this.details.max_quantity === 0) {
          this.details.order_quantity = +this.details.order_quantity + +this.details.quantity_increase;
        }

      } else {
        this.details.order_quantity = +this.details.quantity_start;

      }

      // } else {
      //   if (value >= 1) {
      //     this.details.order_quantity = value;
      //   }
      // }
    }

  }

  ngOnInit(): void {
    this._fuseSplashScreenService.show();
    window.scroll(0 ,0);
    this.activatedRoute.params.subscribe(paramsId => {
        this.id = +paramsId.id;
        this.getProductDetails();
      });
  }

}
