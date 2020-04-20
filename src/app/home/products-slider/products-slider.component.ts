import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
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
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog,
  ) {

  }



  decreaseQuantity(item: ProductModel) {
    if (item.order_quantity > 1) {
      let index = this.data.Products.indexOf(item);
      this.data.Products[index].order_quantity = item.order_quantity - 1;
    }
  }

  updateQuantity(item: ProductModel, value) {
    let index = this.data.Products.indexOf(item);
    this.data.Products[index].order_quantity = value;

  }


  increaseQuantity(item: ProductModel) {
    let index = this.data.Products.indexOf(item);
    if (item.order_quantity > 0) {
      this.data.Products[index].order_quantity = +item.order_quantity + 1;
    } else {
      this.data.Products[index].order_quantity = 1;

    }
  }


  favourite(product: ProductModel) {
    let model = new FavouriteModel();
    if (product.Favourite) {
      model.status = 0;
    } else {
      model.status = 1;
    }
    model.product_id = product.product_id;
    this.restService.addFavourite(model).then((res) => {
      if (res.code === 200) {
        let index = this.data.Products.indexOf(product);

        if (model.status === 1) {
          this.data.Products[index].Favourite = res.data;
        } else {
          this.data.Products[index].Favourite = null;
        }
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }


  ngOnInit() {
    this.carouselOptions = {
      grid: {xs: 1, sm: 3, md: 3, lg: 4, all: 0},
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
