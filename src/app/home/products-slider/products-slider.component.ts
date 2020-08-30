import {Component, Input, OnInit} from '@angular/core';
import {AppService} from '../../app.service';
import {Category} from '../../../models/category';
import {DataService} from '../../../services/data.service';
import {NguCarouselConfig} from '@stockopedia/carousel';
import {HttpErrorResponse} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {FavouriteModel, ProductModel} from "../../../models/product.model";

@Component({
  selector: 'app-products-slider',
  templateUrl: './products-slider.component.html',
  styleUrls: ['./products-slider.component.scss']
})
export class ProductsSliderComponent implements OnInit {
  @Input() data: Category;
  @Input() background: boolean;
  public carouselOptions: NguCarouselConfig;
  details: ProductModel;


  constructor(public restService: DataService,
              private toastr: ToastrService,
              public _appService: AppService,

  ) {

  }


  decreaseQuantity(item: ProductModel) {
    if (item.order_quantity > +item.quantity_start) {
      let index = this.data.products.indexOf(item);
      this.data.products[index].order_quantity = item.order_quantity - +item.quantity_increase;
    }
  }

  updateQuantity(item: ProductModel, value) {
    let index = this.data.products.indexOf(item);
    this.data.products[index].order_quantity = value;

  }


  increaseQuantity(item: ProductModel) {
    let index = this.data.products.indexOf(item);
    if (item.order_quantity > 0) {
      if (item.max_quantity > 0 && item.max_quantity >= +item.order_quantity + +item.quantity_increase) {
        this.data.products[index].order_quantity = +item.order_quantity + +item.quantity_increase;
      } else if (item.max_quantity === 0) {
        this.data.products[index].order_quantity = +item.order_quantity + +item.quantity_increase;
      }
    } else {
      this.data.products[index].order_quantity = +item.quantity_start;

    }
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
        let index = this.data.products.indexOf(product);

        if (model.status === 1) {
          this.data.products[index].favourite = res.data;
        } else {
          this.data.products[index].favourite = null;
        }
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }


  ngOnInit() {
    this.carouselOptions = {
      grid: {xs: 1, sm: 2, md: 3, lg: 4, all: 0},
      slide: 4,
      speed: 400,
      interval: {
        timing: 4000
      },
      point: {
        visible: false
      },
      load: 2,
      touch: true,
      loop: true
    };
  }

}
