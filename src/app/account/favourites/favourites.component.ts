import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {DataService} from '../../../services/data.service';
import {FormBuilder} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {AppService} from '../../app.service';
import {ToastrService} from 'ngx-toastr';
import AOS from 'aos';
import {PaginationModel} from '../../../models/pagination.model';
import {FavouriteModel, ProductModel} from '../../../models/product.model';


@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {
  favourites: FavouriteModel[] = [];
  currentFavourites: FavouriteModel[] = [];
  pagination = new PaginationModel();

  constructor(public restService: DataService,
              private fb: FormBuilder,
              private dialog: MatDialog,
              public appService: AppService,
              private toastr: ToastrService) {

  }


  favourite(product: ProductModel) {
    let model = new FavouriteModel();
    model.product_id = product.product_id;
    model.status = 0;
    this.restService.addFavourite(model).then((res) => {
      if (res.code === 200) {
        this.favourites = this.favourites.filter(item => item.Product.product_id != product.product_id);
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }


  decreaseQuantity(item: FavouriteModel) {
    if (item.Product.order_quantity > 1) {
      let index = this.favourites.indexOf(item);
      this.favourites[index].Product.order_quantity = item.Product.order_quantity - 1;
    }
  }

  updateQuantity(item: FavouriteModel, value) {
    let index = this.favourites.indexOf(item);
    this.favourites[index].Product.order_quantity = value;

  }


  increaseQuantity(item: FavouriteModel) {
    let index = this.favourites.indexOf(item);
    if (item.Product.order_quantity > 0) {
      this.favourites[index].Product.order_quantity = +item.Product.order_quantity + 1;
    } else {
      this.favourites[index].Product.order_quantity = 1;

    }
  }

  getDetails(item: FavouriteModel) {
    let favorite = new FavouriteModel();
    favorite.favourite_id = item.favourite_id.toString();
    favorite.product_id = item.product_id;
    favorite.status = 1;
    item.Product.Favourite = favorite;
    this.appService.getDetails(item.Product);
  }

  getFavourite() {
    this.restService.getFavourites(this.pagination).then((res) => {
      if (res.code === 200) {

        if (this.pagination.page == 0) {
          this.favourites = res.data;
          this.currentFavourites = res.data;
        } else {
          this.currentFavourites = res.data;
          this.currentFavourites.forEach(item => {
            this.favourites.push(item);
          });
        }


      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }


  ngOnInit() {
    scrollTo(0, 0);
    AOS.init();
    this.getFavourite();
  }

}
