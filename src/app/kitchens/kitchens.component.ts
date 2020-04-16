import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {DataService} from '../../services/data.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {Category} from '../../models/category';
import {AppService} from '../app.service';
import {FarmerModel} from '../../models/farmer.model';
import {FilterModel} from '../../models/filter.model';
import AOS from 'aos';


@Component({
  selector: 'app-kitchens',
  templateUrl: './kitchens.component.html',
  styleUrls: ['./kitchens.component.scss']
})
export class KitchensComponent implements OnInit {
  banners = [{
    image: '/images/banner.png',
  }];
  category: Category;
  pagination = new FilterModel();
  farmer: FarmerModel[] = [];
  allFarmer: FarmerModel[] = [];
  count = 0;

  constructor(public restService: DataService,
              private toastr: ToastrService,
              private appService: AppService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder) {

  }


  search(value) {
    if (value) {
      this.appService.keyword = value;
      this.router.navigate(['/products']);
    }
  }


  filter(keyword) {

    this.pagination.keyword = keyword;
    this.pagination.page = 0;
    this.getFarmers();

  }

  getFarmers() {
    this.restService.getFarmers(this.pagination).then((res) => {
      if (res.code === 200) {
        this.count = res.data.count;
        this.farmer = res.data.Farmers;
        if (this.pagination.page == 0) {
          this.allFarmer = this.farmer;
        } else {
          this.farmer.forEach(item => {
            this.allFarmer.push(item);
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
    AOS.init();
    this.pagination.page = 0;
    this.getFarmers();
  }

}
