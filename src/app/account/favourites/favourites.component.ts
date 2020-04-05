import { Component, OnInit } from '@angular/core';
import {UserModel} from '../../../models/user.model';
import {HttpErrorResponse} from '@angular/common/http';
import {DataService} from '../../../services/data.service';
import {FormBuilder} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {AppService} from '../../app.service';
import {ToastrService} from 'ngx-toastr';
import {FavouriteModel, MealModel} from '../../../models/meal.model';
import * as $ from 'jquery';
import {DeliveryDetailsComponent} from '../../dialogs/delivery-details/delivery-details.component';
import AOS from 'aos';
import {PaginationModel} from '../../../models/pagination.model';


@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.scss']
})
export class FavouritesComponent implements OnInit {
  favourites: FavouriteModel[] = [] ;
  currentFavourites: FavouriteModel[] = [] ;
  pagination = new PaginationModel();
  constructor(public restService: DataService,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private appService: AppService,
              private toastr: ToastrService) {

  }

  openMealDetails() {
    $('.product-card').hover(function() {
      $(this).addClass('animate');
      $('div.carouselNext, div.carouselPrev').addClass('visible');
    }, function() {
      $(this).removeClass('animate');
      $('div.carouselNext, div.carouselPrev').removeClass('visible');
    });
  }

  openDialogDelivery(id) {

    let dialogRef = this.dialog.open(DeliveryDetailsComponent);
    // dialogRef.componentInstance.data = data;
    // dialogRef.afterClosed().subscribe(result => {
    //   let index = this.dataSource.filteredData.indexOf(data);
    //   this.dataSource.filteredData[index] = result;
    //   this.dataSource = new MatTableDataSource(this.dataSource.filteredData);
    // });

  }


  favourite(meal: MealModel) {
    let model = new FavouriteModel();
      model.meal_id = meal.meal_id;
      model.status = 0;
    this.restService.addFavourite(model).then((res) => {
      if (res.code === 200) {
       this.favourites = this.favourites.filter(item => item.Meal.meal_id != meal.meal_id )
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
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
    scrollTo(0,0);
    AOS.init();
    this.getFavourite();
  }

}
