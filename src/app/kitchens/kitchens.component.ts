import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {DataService} from '../../services/data.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {PaginationModel} from '../../models/pagination.model';
import {Category, KitchensModel} from '../../models/category';
import {AppService} from '../app.service';
import {KitchenModel} from '../../models/kitchen.model';

@Component({
  selector: 'app-kitchens',
  templateUrl: './kitchens.component.html',
  styleUrls: ['./kitchens.component.scss']
})
export class KitchensComponent implements OnInit {

  category: Category;
  pagination = new PaginationModel();
  kitchens: KitchensModel;
  allKitchens: KitchenModel[] = [];

  constructor(public restService: DataService,
              private toastr: ToastrService,
              private appService: AppService,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder) {

  }


  filter(keyword) {

    this.pagination.keyword = keyword;
    if (this.pagination.id != 0) {
      this.getKitchens();
    } else {
      this.getKitchensByLocations();
    }
  }

  getKitchens() {
    this.restService.kitchens(this.pagination).then((res) => {
      if (res.code === 200) {
        this.category = res.data;
        this.kitchens = this.category.kitchens;
        if (this.pagination.page == 0) {
          this.allKitchens = [];
          this.allKitchens = this.kitchens.kitchens;
        } else {
          this.kitchens.kitchens.forEach(item => {
            this.allKitchens.push(item);
          });
        }
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  getKitchensByLocations() {
    let location = JSON.parse(localStorage.getItem('location'));
    this.pagination.lat = location.latitude;
    this.pagination.lng = location.longitude;
    this.restService.getKitchensByLocation(this.pagination).then((res) => {
      if (res.code === 200) {
        this.kitchens = res.data;
        if (this.pagination.page == 0) {
          this.allKitchens = [];
          this.allKitchens = this.kitchens.kitchens;
        } else {
          this.kitchens.kitchens.forEach(item => {
            this.allKitchens.push(item);
          });
        }
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  ngOnInit() {
    scrollTo(0, 0);
    this.activatedRoute.params.subscribe(paramsId => {
      this.pagination.id = paramsId.id;
      this.pagination.page = 0;
      if (paramsId.id != 0) {
        this.getKitchens();
      } else {
        this.getKitchensByLocations();
      }
    });

  }

}
