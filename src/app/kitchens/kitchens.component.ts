import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {DataService} from '../../services/data.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {PaginationModel} from '../../models/pagination.model';
import {Category, KitchensModel} from '../../models/category';
import {AppService} from '../app.service';
import {KitchenModel} from '../../models/kitchen.model';
import {FarmerModel} from '../../models/farmer.model';

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
  pagination = new PaginationModel();
  farmer: FarmerModel[]=[];
  allFarmer: FarmerModel[] = [];

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
    if (this.pagination.id != 0) {
      this.getFarmers();
    } else {
      // this.getKitchensByLocations();
    }
  }

  getFarmers() {
    this.restService.getFarmers().then((res) => {
      if (res.code === 200) {
        this.farmer = res.data;
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

  // getKitchensByLocations() {
  //   let location = JSON.parse(localStorage.getItem('location'));
  //   this.pagination.lat = location.latitude;
  //   this.pagination.lng = location.longitude;
  //   this.restService.getKitchensByLocation(this.pagination).then((res) => {
  //     if (res.code === 200) {
  //       this.kitchens = res.data;
  //       if (this.pagination.page == 0) {
  //         this.allKitchens = [];
  //         this.allKitchens = this.kitchens.kitchens;
  //       } else {
  //         this.kitchens.kitchens.forEach(item => {
  //           this.allKitchens.push(item);
  //         });
  //       }
  //     } else {
  //       this.toastr.error(res.message, '');
  //     }
  //   }).catch((err: HttpErrorResponse) => {
  //   });
  // }

  ngOnInit() {
    scrollTo(0, 0);
    this.pagination.page = 0;
    this.getFarmers();
  }

}
