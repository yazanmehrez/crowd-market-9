import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AppService} from '../../app.service';
import {SlickCarouselComponent} from 'ngx-slick-carousel';
import {ProductModel} from '../../../models/product.model';
import {Category} from '../../../models/category';
import {DataService} from '../../../services/data.service';

@Component({
  selector: 'app-products-slider',
  templateUrl: './products-slider.component.html',
  styleUrls: ['./products-slider.component.scss']
})
export class ProductsSliderComponent implements OnInit {
  @Input() data: Category;
  @Input() background: boolean;
  @ViewChild('slickModal', { static: true }) slickModal: SlickCarouselComponent;

  slideConfig = {
    slidesToShow: 4,
    slidesToScroll: 1,
    infinite: true,
    focusOnSelect: true,
    arrows: true,
    prevArrow: false,
    nextArrow: true,
    autoplay: true,
    responsive: [
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          dots: false,
          infinite: true,
          arrows: true,
          focusOnSelect: true,
          prevArrow: false,
          nextArrow: true,
          autoplay: false
        }
      },
      {
        breakpoint: 1400,
        settings: {
          dots: false,
          infinite: true,
          focusOnSelect: true,
          arrows: true,
          prevArrow: false,
          nextArrow: true,
          autoplay: false
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
  }

  slickInit(e) {
    console.log(e);
    console.log('slick initialized');
  }

  next() {
    this.slickModal.slickNext();
  }

  ngOnInit() {
  }

}
