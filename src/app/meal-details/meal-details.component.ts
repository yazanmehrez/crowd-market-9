import {AfterViewInit, Component, OnInit} from '@angular/core';
import '../../icons';
import * as $ from 'jquery';
import {HttpErrorResponse} from '@angular/common/http';
import {DataService} from '../../services/data.service';
import {FavouriteModel, MealModel} from '../../models/meal.model';
import {JwtHelperService} from '@auth0/angular-jwt';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {DeliveryDetailsComponent} from '../dialogs/delivery-details/delivery-details.component';
import {MatDialog} from '@angular/material';


@Component({
  selector: 'app-meal-details',
  templateUrl: './meal-details.component.html',
  styleUrls: ['./meal-details.component.scss']
})
export class MealDetailsComponent implements OnInit, AfterViewInit {
  related: MealModel[] = [];
  details: MealModel;
  isLogin = '';
  slideConfig = {
    'slidesToShow': 3,
    'slidesToScroll': 1,
    'infinite': true,
    focusOnSelect: true,
    autoplay: true,
    responsive: [
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          dots: true
        }
      },
      {
        breakpoint: 1400,
        settings: {
          dots: true
        }
      }
      , {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          dots: true

        }
      }
    ]
    // dots: true

  };

  constructor(public restService: DataService,
              public jwtHelper: JwtHelperService,
              private toastr: ToastrService,
              private activatedRoute: ActivatedRoute,
              private dialog:MatDialog
  ) {
  }

  slickInit(e) {
    console.log('slick initialized');
  }

  openDialogDelivery(meal: MealModel) {

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
    if (meal.Favourite) {
      model.meal_id = meal.meal_id;
      model.status = 0;
    } else {
      model.meal_id = meal.meal_id;
      model.status = 1;
    }
    this.restService.addFavourite(model).then((res) => {
      if (res.code === 200) {
        if (model.status == 0) {
          meal.Favourite = null;
        } else {
          meal.Favourite = res.data;
        }
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }


  ngAfterViewInit() {

    $(document).ready(function() {
      // Lift card and show stats on Mouseover
      $('.product-card').hover(function() {
        $(this).addClass('animate');
        $('div.carouselNext, div.carouselPrev').addClass('visible');
      }, function() {
        $(this).removeClass('animate');
        $('div.carouselNext, div.carouselPrev').removeClass('visible');
      });

    });
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

  getMealDetails(id) {
    this.restService.mealDetails(id).then((res) => {
      if (res.code === 200) {
        this.details = res.data;
        this.getRelatedMeals( this.details.Category.category_id);

      } else {
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }


  getRelatedMeals(id) {
    this.restService.relatedMeals(id).then((res) => {
      if (res.code === 200) {
        this.related = res.data;
      } else {
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  ngOnInit() {
    scrollTo(0,0);
    this.activatedRoute.params.subscribe(paramsId => {
      this.getMealDetails(paramsId.id);
    });
    this.isLogin = this.jwtHelper.decodeToken(localStorage.getItem('auth_token_CrowdMarket')).email;

  }

}
