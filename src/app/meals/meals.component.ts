import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DataService} from '../../services/data.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {FilterModel} from '../../models/filter.model';
import {Category} from '../../models/category';
import {MatDialog} from '@angular/material';
import {CountiesFoodComponent} from '../dialogs/counties-food/counties-food.component';
import AOS from 'aos';
import {AppService} from '../app.service';
import {BannerModel} from '../../models/home.model';
import {FarmerModel} from '../../models/farmer.model';
import {ProductModel} from '../../models/product.model';
import {MediaMatcher} from '@angular/cdk/layout';


@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class MealsComponent implements OnInit {
  details = {
    'product_id': 82,
    'name': '16 Pieces Baked Chicken Wings',
    'description': 'description_en',
    'price': 10,
    'image': '/images/fafb112ca8e328a8b7b3d555709d9527.jpg',
    'type': 0,
    'active': 1,
    'new_price': 5.5,
    'discount': 1,
    'Farmer': null,
    'Category': {
      'category_id': 1,
      'name': 'Fruits',
      'active': 1
    },
    'Favourite': null
  };
  kitchen = '';
  category = '';
  title = '';
  titlePage: string;
  currentProducts: ProductModel[] = [];
  filter = new FilterModel();
  categories: Category[] = [];
  banners: BannerModel[] = [];
  farmers: FarmerModel[] = [];
  mobileQuery: MediaQueryList;
  fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);
  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
  private _mobileQueryListener: () => void;

  constructor(public restService: DataService,
              private toastr: ToastrService,
              public appService: AppService,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog,
              changeDetectorRef: ChangeDetectorRef, media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  selectFarmer(item) {
    if (item) {
      this.filter.farmer_id = item.farmer_id;
      if (this.appService.currentLanguage === 'en') {
        this.title = item.title + ' Products ';
      } else {
        this.title = item.title + ' منتجات ';
      }
    } else {
      this.title = '';
    }
  }

  changeFilter() {
    this.filter.page = 0;
    this.filterProduct();
  }

  filterProduct() {
    this.titlePage = this.title;
    this.restService.filterProducts(this.filter).then((res) => {
      if (res.code === 200) {
        if (this.filter.page === 0) {
          this.restService.products = res.data.Products;
          this.currentProducts = res.data.Products;

        } else {
          this.currentProducts = res.data.Products;
          this.currentProducts.forEach(item => {
            this.restService.products.push(item);
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

  getBanners() {
    this.restService.getBanners().then((res) => {
      if (res.code === 200) {
        this.banners = res.data;
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  getFarmers() {
    this.restService.getFarmers().then((res) => {
      if (res.code === 200) {
        this.farmers = res.data;
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  search(value) {
    this.filter.keyword = value;
    this.filter.page = 0;
    this.filterProduct();
  }


  ngOnInit() {
    scrollTo(0, 0);
    AOS.init();
    if (this.appService.keyword) {
      this.filter.keyword = this.appService.keyword;
    }
    if (this.appService.category_id) {
      this.filter.category_id = this.appService.category_id;
    }
    this.filter.page = 0;
    this.activatedRoute.params.subscribe(paramsId => {
      this.filterProduct();
      this.getBanners();
      this.getCategories();
      this.getFarmers();
    });

  }


}


