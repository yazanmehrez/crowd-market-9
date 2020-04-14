import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AppService} from '../../app.service';
import {SlickCarouselComponent} from 'ngx-slick-carousel';
import {ProductModel} from '../../../models/product.model';
import {Category} from '../../../models/category';
import {DataService} from '../../../services/data.service';
import {MealModel} from '../../../models/meal.model';

@Component({
  selector: 'app-products-slider',
  templateUrl: './products-slider.component.html',
  styleUrls: ['./products-slider.component.scss']
})
export class ProductsSliderComponent implements OnInit {
  @Input() data: Category;
  @Input() background: boolean;
  @ViewChild('slickModal', { static: true }) slickModal: SlickCarouselComponent;

  slideConfig4 = {
    slidesToShow: 4  ,
    slidesToScroll: 1,
    infinite: true,
    focusOnSelect: false,
    arrows: true,
    prevArrow: false,
    nextArrow: true,
    autoplay: false,
    accessibility: false,
    touchMove: false,
    draggable: false,
    responsive: [
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          dots: false,
          infinite: true,
          arrows: true,
          focusOnSelect: false,
          prevArrow: false,
          swipe: false,
          nextArrow: true,
          autoplay: false,
          accessibility: false,
          touchMove: false,
          draggable: false,
        }
      },
      {
        breakpoint: 1400,
        settings: {
          dots: false,
          infinite: true,
          focusOnSelect: false,
          arrows: true,
          swipe: false,
          accessibility: false,
          prevArrow: false,
          nextArrow: true,
          autoplay: false,
          touchMove: false,
          draggable: false,
        }
      }, {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          dots: false,
          infinite: true,
          focusOnSelect: true,
          arrows: true,
          prevArrow: false,
          nextArrow: true,
          autoplay: false

        }
      }
    ],
    dots: false
  };




  constructor(public _appService: AppService,
              public restService: DataService) {
    console.log(this.data);
  }

  slickInit(e) {
    // console.log(e);
    // console.log('slick initialized');
  }

  next() {
    this.slickModal.slickNext();
  }

  decreaseQuantity(item: ProductModel) {
    if (item.quantity > 1) {
      let index = this.data.Products.indexOf(item);
      this.data.Products[index].quantity = item.quantity - 1;
    }
  }

  updateQuantity(item: ProductModel, value) {
    let index = this.data.Products.indexOf(item);
    this.data.Products[index].quantity = value;

  }


  increaseQuantity(item: ProductModel) {
    let index = this.data.Products.indexOf(item);
    if (item.quantity > 0) {
      this.data.Products[index].quantity = +item.quantity + 1;
    } else {
      this.data.Products[index].quantity = 1;

    }
  }


  ngOnInit() {

  }

}
