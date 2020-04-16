import {Component, Input, OnInit} from '@angular/core';
import {AppService} from '../../app.service';
import {ProductModel} from '../../../models/product.model';
import {Category} from '../../../models/category';
import {DataService} from '../../../services/data.service';
import {NguCarouselConfig} from '@stockopedia/carousel';

@Component({
    selector: 'app-products-slider',
    templateUrl: './products-slider.component.html',
    styleUrls: ['./products-slider.component.scss']
})
export class ProductsSliderComponent implements OnInit {
    @Input() data: Category;
    @Input() background: boolean;
    public carouselOptions: NguCarouselConfig;

    constructor(public _appService: AppService,
                public restService: DataService) {
        console.log(this.data);
    }

    slickInit(e) {
        // console.log(e);
        // console.log('slick initialized');
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
