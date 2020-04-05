import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import * as $ from 'jquery';
import {Appearance} from '@angular-material-extensions/google-maps-autocomplete';
import {DataService} from '../../services/data.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {FavouriteModel, MealModel, TypeModel} from '../../models/meal.model';
import {FilterModel} from '../../models/filter.model';
import {Category} from '../../models/category';
import {PaginationModel} from '../../models/pagination.model';
import {DeliveryDetailsComponent} from '../dialogs/delivery-details/delivery-details.component';
import {MatDialog} from '@angular/material';
import {JwtHelperService} from '@auth0/angular-jwt';
import {CountiesFoodComponent} from '../dialogs/counties-food/counties-food.component';
import {KitchensDialogComponent} from '../dialogs/kitchens-dialog/kitchens-dialog.component';
import AOS from 'aos';

import PlaceResult = google.maps.places.PlaceResult;
import {AppService} from '../app.service';


@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class MealsComponent implements OnInit {

  kitchen_id: number;
  kitchen = '';
  category = '';
  title: string;
  meals: MealModel[] = [];
  currentMeals: MealModel[] = [];
  kitchens: Category;
  types: TypeModel[] = [];
  filter = new FilterModel();
  public appearance = Appearance;
  public zoom: number;
  public latitude: number;
  public longitude: number;
  public location: string;
  public isLogin = '';
  categories: Category[] = [];
  pagination = new PaginationModel();
  nextIndex= 2;


  constructor(public restService: DataService,
              private toastr: ToastrService,
              private appService: AppService,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog,
              public jwtHelper: JwtHelperService,
             ) {
  }

  onLocationSelected(location: Location) {
    console.log('onLocationSelected: ', location);
    // this.latitude = location.latitude;
    // this.longitude = location.longitude;
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



  openMealDetails() {
    $('.product-card').hover(function() {
      $(this).addClass('animate');
      $('div.carouselNext, div.carouselPrev').addClass('visible');
    }, function() {
      $(this).removeClass('animate');
      $('div.carouselNext, div.carouselPrev').removeClass('visible');
    });
  }

  selectCategory(item) {
    this.filter.category_id = item.category_id;
    this.category = item.name;
    this.kitchen = '';
    this.filter.kitchen_id = '0';
    this.getKitchens(item.category_id);
  }

  changeFilter() {
    this.filter.page = 0;
    this.filterMeals();
  }

  filterMeals() {
    if (this.kitchen) {
      this.title = this.kitchen;
    } else {
      this.title = this.category;
    }
    this.restService.filterMeals(this.filter).then((res) => {
      if (res.code === 200) {
        if (this.filter.page == 0) {
          this.restService.Meals = res.data.Meals;
          this.currentMeals = res.data.Meals;

        } else {
          this.currentMeals = res.data.Meals;
          this.currentMeals.forEach(item => {
            this.restService.Meals.push(item);
          });
        }


      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  openCategoryDialog() {
    let dialogRef = this.dialog.open(CountiesFoodComponent);
    dialogRef.componentInstance.data = this.categories;
    dialogRef.afterClosed().subscribe(result => {
      this.filter.category_id = result;
      this.getKitchens(result);

    });
  }


  openKitchensDialog() {
    let dialogRef = this.dialog.open(KitchensDialogComponent);
    dialogRef.componentInstance.category_id = this.filter.category_id;
    dialogRef.afterClosed().subscribe(result => {
      this.filter.kitchen_id = result;
    });
  }

  getCategories() {
    this.restService.categories().then((res) => {
      if (res.code === 200) {
        this.categories = res.data;
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  getTypeFood() {
    this.restService.getTypes().then((res) => {
      if (res.code === 200) {
        this.types = res.data;
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  getKitchens(id) {
    this.pagination.id = id;
    this.restService.kitchens(this.pagination).then((res) => {
      if (res.code === 200) {
        this.kitchens = res.data;
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  allKitchen() {
    this.filter.kitchen_id = '0';
    this.filter.category_id = '0';
    this.kitchens.kitchens.kitchens = [];
  }




  ngOnInit() {
    scrollTo(0,0);
    AOS.init();
    this.appService.active = 1;
    this.filter.page = 0;
    this.setCurrentPosition();
    this.activatedRoute.params.subscribe(paramsId => {
      this.filter.kitchen_id = this.kitchen_id = paramsId.id;
      this.filterMeals();
      this.getCategories();
      this.getTypeFood();
    });

    this.isLogin = localStorage.getItem('auth_token_aklbetna')?  this.jwtHelper.decodeToken(localStorage.getItem('auth_token_aklbetna')).email : '';

  }


  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

}


