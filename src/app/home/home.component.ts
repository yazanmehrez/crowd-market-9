import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as $ from 'jquery';
import {MatDialog} from '@angular/material';
import {DataService} from '../../services/data.service';
import {HttpErrorResponse} from '@angular/common/http';
import {HomeModel} from '../../models/home.model';
import {ToastrService} from 'ngx-toastr';
import {MealModel} from '../../models/meal.model';
import {JwtHelperService} from '@auth0/angular-jwt';
import {PaginationModel} from '../../models/pagination.model';
import AOS from 'aos';
import {Appearance} from '@angular-material-extensions/google-maps-autocomplete';
import {AppService} from '../app.service';
import {Router} from '@angular/router';
import PlaceResult = google.maps.places.PlaceResult;
import { MapsAPILoader, MouseEvent } from '@agm/core';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  images = [700, 533, 807, 124].map((n) => `https://picsum.photos/id/${n}/900/500`);
  locationForm: FormGroup;
  data: HomeModel;
  dataMeals: MealModel[] = [];
  nextIndex = 2;
  slides: any = [[]];
  isLogin = '';
  pagination = new PaginationModel();
  address: string;
  i = 0;
  public appearance = Appearance;
  public zoom: number;
  public latitude: string;
  public longitude: string;
  public location: string;
  // private geoCoder =   new google.maps.Geocoder ();


  constructor(config: NgbCarouselConfig,
              private _formBuilder: FormBuilder,
              private mapsAPILoader: MapsAPILoader,
              public restService: DataService,
              private dialog: MatDialog,
              private appService: AppService,
              public jwtHelper: JwtHelperService,
              private toastr: ToastrService,
              private router: Router
  ) {
    config.interval = 10000;
    config.wrap = false;
    config.keyboard = false;
    config.pauseOnHover = false;
    this.pagination.page = -1;

    // this.geoCoder = new google.maps.Geocoder();

  }

  get f() {
    return this.locationForm.controls;
  }

  chunk(arr, chunkSize) {
    let R = [];
    for (let i = 0, len = arr.length; i < len; i += chunkSize) {
      R.push(arr.slice(i, i + chunkSize));
    }
    return R;
  }

  home() {
    this.restService.home().then((res) => {
      if (res.code === 200) {
        this.data = res.data;
        this.slides = this.chunk(this.data.featuredKitchens, 3);
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  featuredMeals() {
    this.pagination.page = this.pagination.page + 1;
    this.restService.featuredMeals(this.pagination).then((res) => {
      if (res.code === 200) {
        this.dataMeals = res.data;
        if (this.pagination.page == 0) {
          this.restService.Meals = this.dataMeals;
        } else {
          this.dataMeals.forEach(item => {
            this.restService.Meals.push(item);
          });
        }
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  onLocationSelected(location: Location) {
    localStorage.setItem('location', JSON.stringify(location));
  }

  onAutocompleteSelected(result: PlaceResult) {
    console.log(result);
    this.location = result.formatted_address;
  }

  prepare() {
    this.locationForm = this._formBuilder.group({
      location: []
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      var productList = document.querySelector('.carousel-indicators').children;
      for (let i = 0; i < productList.length; i++) {
        let value = '<span>0' + (i + 1) + '</span>';
        productList[i].innerHTML = value;

      }
    }, 500);

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

  ngOnInit() {
    scrollTo(0, 0);
    this.prepare();
    this.appService.active = 0;
    AOS.init();
    this.isLogin = localStorage.getItem('auth_token_aklbetna') ? this.jwtHelper.decodeToken(localStorage.getItem('auth_token_aklbetna')).email : '';
    this.home();
    this.featuredMeals();
    this.setCurrentPosition();

  }

  // getAddress(latitude, longitude) {
  //   this.geoCoder.geocode({location: {lat: latitude, lng: longitude}}, (results, status) => {
  //     console.log(results);
  //     console.log(status);
  //     if (status === 'OK') {
  //       if (results[0]) {
  //         this.zoom = 12;
  //         this.address = results[0].formatted_address;
  //       } else {
  //         window.alert('No results found');
  //       }
  //     } else {
  //       window.alert('Geocoder failed due to: ' + status);
  //     }
  //
  //   });
  // }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        localStorage.setItem('location', JSON.stringify({latitude: position.coords.latitude, longitude: position.coords.longitude}));
        // this.getAddress(this.latitude, this.longitude);
      });
    }
  }


}
