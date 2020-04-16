import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {DataService} from '../../services/data.service';
import {ToastrService} from 'ngx-toastr';
import {AppService} from '../app.service';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {JwtHelperService} from '@auth0/angular-jwt';
import {PaginationModel} from '../../models/pagination.model';
import {Category} from '../../models/category';
import {FormControl} from '@angular/forms';
import {KitchenModel} from '../../models/kitchen.model';
import {FilterModel} from '../../models/filter.model';
import {OfferModel} from '../../models/offer.model';

@Component({
    selector: 'app-offers',
    templateUrl: './offers.component.html',
    styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
    pagination = new PaginationModel();
    categories: Category[] = [];
    allCategories: Category[] = [];
    kitchens: KitchenModel[] = [];
    allKitchens: KitchenModel[] = [];
    control = new FormControl();
    filter = new FilterModel();
    allOffers: OfferModel [] = [];
    offers: OfferModel[] = [];

    constructor(public restService: DataService,
                private toastr: ToastrService,
                private appService: AppService,
                private activatedRoute: ActivatedRoute,
                private dialog: MatDialog,
                public jwtHelper: JwtHelperService,
    ) {
    }

    getCategories() {
        this.restService.categories().then((res) => {
            if (res.code === 200) {
                this.categories = res.data;
                this.allCategories = res.data;
            } else {
                this.toastr.error(res.message, '');
            }
        }).catch((err: HttpErrorResponse) => {
        });
    }

    filterCategories(e) {
        let filterValue = e.target.value;
        if (filterValue) {
            this.categories = this.allCategories.filter(item => item.name.toLowerCase().replace(/\s/g, '').includes(filterValue));

        } else {
            this.categories = this.allCategories;
        }
    }


    filterKitchens(e) {
        let filterValue = e.target.value;
        if (filterValue) {
            this.kitchens = this.allKitchens.filter(item => item.name.toLowerCase().replace(/\s/g, '').includes(filterValue));
        } else {
            this.kitchens = this.allKitchens;
        }
    }


    getKitchens(value) {
        let id: number;
        let category: Category[];
        if (value == 'all') {
            id = 0;
        } else {
            category = this.allCategories.filter(item => item.name === value);
            id = +category[0].category_id;
        }
        this.filter.category_id = id;
        $('.kitchen').val('All');
        this.pagination.id = id;
        this.restService.kitchens(this.pagination).then((res) => {
            if (res.code === 200) {
                this.filterOffers();
                this.kitchens = res.data.kitchens.kitchens;
                this.allKitchens = res.data.kitchens.kitchens;
            } else {
                this.toastr.error(res.message, '');
            }
        }).catch((err: HttpErrorResponse) => {
        });

    }


    filterOffersByKitchen(value) {
        let kitchen: KitchenModel[];
        if (value == 'all') {
            this.filter.kitchen_id = '0';
            this.filterOffers();
        } else {
            kitchen = this.allKitchens.filter(item => item.name === value);
            this.filter.kitchen_id = kitchen[0].kitchen_id;
            this.filterOffers();
        }

    }

    updateQuantity(item: OfferModel, value) {
        let index = this.offers.indexOf(item);
        this.offers[index].quantity = value;

    }

    filterOffers() {
        this.restService.offers(this.filter).then((res) => {
            if (res.code === 200) {
                this.offers = res.data;
                if (this.filter.page == 0) {
                    this.allOffers = res.data;
                } else {
                    this.offers.forEach(item => {
                        this.allOffers.push(item);
                    });
                }
            } else {
                this.toastr.error(res.message, '');
            }
        }).catch((err: HttpErrorResponse) => {
        });
    }

    ngOnInit() {
        this.filter.page = 0;
        this.getCategories();
        this.filterOffers();
        scrollTo(0, 0);
        this.appService.active = 3;

    }

}
