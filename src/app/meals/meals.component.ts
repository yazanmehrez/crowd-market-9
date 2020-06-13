import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DataService} from '../../services/data.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {FilterModel} from '../../models/filter.model';
import {Category, CategoryTypeModel, TypeModel} from '../../models/category';
import {MatDialog} from '@angular/material/dialog';
import {CountiesFoodComponent} from '../dialogs/counties-food/counties-food.component';
import AOS from 'aos';
import {AppService} from '../app.service';
import {FarmerModel} from '../../models/farmer.model';
import {FavouriteModel, ProductModel} from '../../models/product.model';


@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class MealsComponent implements OnInit {
  inProgress = true;
  noData = false;
  details: ProductModel;
  title = '';
  titlePage: string;
  currentProducts: ProductModel[] = [];
  filter = new FilterModel();
  categories: Category[] = [];
  selectedCategory: Category;
  products: ProductModel[] = [];
  farmers: FarmerModel[] = [];
  types: TypeModel[] [];
  categoryTypes: CategoryTypeModel[] [];
  sliceTo = 0;
  banners = [{
    image: 'assets/images/products.jpeg',
    description: '_Products'
  }];

  constructor(public restService: DataService,
              private toastr: ToastrService,
              public appService: AppService,
              private activatedRoute: ActivatedRoute,
              private dialog: MatDialog,
              private router: Router
  ) {

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
      this.filter.farmer_id = 0;
    }
  }

  changeFilter() {
    this.filter.page = 0;
    this.filter.keyword = '';
    this.appService.keyword.next({type: 'search', value: ''});
    this.filterProduct();

  }

  filterProduct() {
    this.titlePage = this.title;
    this.restService.filterProducts(this.filter).then((res) => {
      if (res.code === 200) {
        this.currentProducts = res.data.Products;
        if (this.filter.page === 0) {
          this.products = res.data.Products;
          if (this.products.length === 0) {
            this.noData = true;
          } else {
            this.noData = false;
          }
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
        if (this.filter.category_id !== 0) {
          let category = this.categories.filter(item => +item.category_id === +this.filter.category_id);
          this.selectedCategory = category[0];
        }
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }


  getTypes() {
    this.restService.getTypes().then((res) => {
      if (res.code === 200) {
        this.types = res.data;
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
    if (item.order_quantity > +item.quantity_start) {
      let index = this.products.indexOf(item);
      this.products[index].order_quantity = item.order_quantity - +item.quantity_increase;
    }
  }

  updateQuantity(item: ProductModel, value) {
    if (value >= 1) {
      let index = this.products.indexOf(item);
      this.products[index].order_quantity = value;

    }

  }


  increaseQuantity(item: ProductModel) {
    let index = this.products.indexOf(item);
    if (item.order_quantity > 0) {
      this.products[index].order_quantity = +item.order_quantity + +item.quantity_increase;
    } else {
      this.products[index].order_quantity = +item.quantity_start;

    }
  }

  favourite(product: ProductModel) {
    let model = new FavouriteModel();
    if (product.favourite) {
      model.status = 0;
    } else {
      model.status = 1;
    }
    model.product_id = product.product_id;
    this.restService.addFavourite(model).then((res) => {
      if (res.code === 200) {
        let index = this.products.indexOf(product);

        if (model.status === 1) {
          this.products[index].favourite = res.data;
        } else {
          this.products[index].favourite = null;
        }
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }


  ngOnInit() {
    AOS.init();
    window.scroll(0, 0);
    this.activatedRoute.params.subscribe(paramsId => {
      if (+paramsId.id !== 0) {
        this.filter.category_id = +paramsId.id;
      } else {
        this.filter.category_id = 0;
      }
    });
    this.getTypes();

    this.getCategories();
    this.appService.keyword.subscribe(value => {
      this.filter.keyword = value.type === 'search' ? value.value : '';
      if (value.type === 'category') {
        if (value.value) {
          this.filter.category_id = value.value;
          let category = this.categories.filter(item => item.category_id == value.value);
          this.selectedCategory = category[0];
        }
      }
      this.filter.page = 0;
      // if(this.router.url === '/products/' + this.filter.category_id){
      //   console.log(value);
      this.filterProduct();
      // }
    });


  }

}


