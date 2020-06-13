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
  noData = false;

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
        this.favourites = this.favourites.filter(item => item.product.product_id != product.product_id);
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }


  decreaseQuantity(item: FavouriteModel) {
    if (item.product.order_quantity > +item.product.quantity_start) {
      let index = this.favourites.indexOf(item);
      this.favourites[index].product.order_quantity = item.product.order_quantity - +item.product.quantity_increase;
    }
  }

  updateQuantity(item: FavouriteModel, value) {
    let index = this.favourites.indexOf(item);
    this.favourites[index].product.order_quantity = value;

  }


  increaseQuantity(item: FavouriteModel) {
    let index = this.favourites.indexOf(item);
    if (item.product.order_quantity > 0) {
      this.favourites[index].product.order_quantity = +item.product.order_quantity + +item.product.quantity_increase;
    } else {
      this.favourites[index].product.order_quantity = +item.product.quantity_start;

    }
  }

  getDetails(item: FavouriteModel) {
    let favorite = new FavouriteModel();
    favorite.favourite_id = item.favourite_id.toString();
    favorite.product_id = item.product_id;
    favorite.status = 1;
    item.product.favourite = favorite;
    this.appService.getDetails(item.product);
  }

  getFavourite() {
    this.restService.getFavourites(this.pagination).then((res) => {
      if (res.code === 200) {

        if (this.pagination.page == 0) {
          this.favourites = res.data;
          this.currentFavourites = res.data;
          if (this.favourites.length === 0) {
            this.noData = true;
          } else {
            this.noData = false;
          }
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
    AOS.init();
    this.getFavourite();
  }

}
