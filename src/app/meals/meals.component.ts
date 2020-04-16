import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DataService} from '../../services/data.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {FilterModel} from '../../models/filter.model';
import {Category} from '../../models/category';
import {MatDialog} from '@angular/material/dialog';
import {CountiesFoodComponent} from '../dialogs/counties-food/counties-food.component';
import AOS from 'aos';
import {AppService} from '../app.service';
import {BannerModel} from '../../models/home.model';
import {FarmerModel} from '../../models/farmer.model';
import {ProductModel} from '../../models/product.model';
import {MediaMatcher} from '@angular/cdk/layout';
import {FavouriteModel} from '../../models/meal.model';


@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class MealsComponent implements OnInit {
  inProgress = true;
  details: ProductModel;
  title = '';
  titlePage: string;
  currentProducts: ProductModel[] = [];
  filter = new FilterModel();
  categories: Category[] = [];
  products: ProductModel[] = [];
  banners: BannerModel[] = [];
  farmers: FarmerModel[] = [];
  mobileQuery: MediaQueryList;
  sliceTo = 0;
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
        this.currentProducts = res.data.Products;

        if (this.filter.page === 0) {
          this.products = res.data.Products;
        } else {
          this.currentProducts.forEach(item => {
            this.products.push(item);
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
    dialogRef.componentInstance.data = this.farmers;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.filter.farmer_id = +result;
      }
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
        this.inProgress = false;
      } else {
        this.toastr.error(res.message, '');
        this.inProgress = false;
      }
    }).catch((err: HttpErrorResponse) => {
      this.inProgress = false;
    });
  }

  getFarmers() {
    this.restService.getAllFarmers().then((res) => {
      if (res.code === 200) {
        this.farmers = res.data;
        this.sliceTo = this.farmers.length >= 6 ? 6 : this.farmers.length;
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


  decreaseQuantity(item: ProductModel) {
    if (item.order_quantity > 1) {
      let index = this.products.indexOf(item);
      this.products[index].order_quantity = item.order_quantity - 1;
    }
  }

  updateQuantity(item: ProductModel, value) {
    let index = this.products.indexOf(item);
    this.products[index].order_quantity = value;

  }


  increaseQuantity(item: ProductModel) {
    let index = this.products.indexOf(item);
    if (item.order_quantity > 0) {
      this.products[index].order_quantity = +item.order_quantity + 1;
    } else {
      this.products[index].order_quantity = 1;

    }
  }

  favourite(product: ProductModel) {
    let model = new FavouriteModel();
    if (product.Favourite) {
      model.status = 0;
    } else {
      model.status = 1;
    }
    model.product_id = product.product_id;
    this.restService.addFavourite(model).then((res) => {
      if (res.code === 200) {
        let index = this.products.indexOf(product);

        if (model.status === 1) {
          this.products[index].Favourite = res.data;
        } else {
          this.products[index].Favourite = null;
        }
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
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
    if (this.appService.farmer_id) {
      this.filter.farmer_id = this.appService.farmer_id;
    }
    this.filter.page = 0;
    this.activatedRoute.params.subscribe(paramsId => {
      this.filterProduct();
      this.getBanners();
      this.getCategories();
      this.getFarmers();
    });

  }


  navSettings(status: string) {
    // document.getElementsByClassName('products')[0].scrollIntoView();
    if (status === 'opened') {
      $('html').css('overflow', 'hidden');
    } else {
      $('html').css('overflow', 'auto');
    }
  }
}


