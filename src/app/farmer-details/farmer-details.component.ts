import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../app.service';
import {HttpErrorResponse} from '@angular/common/http';
import {DataService} from '../../services/data.service';
import {ToastrService} from 'ngx-toastr';
import {FilterModel} from '../../models/filter.model';
import {FarmerModel} from '../../models/farmer.model';

@Component({
  selector: 'app-farmer-details',
  templateUrl: './farmer-details.component.html',
  styleUrls: ['./farmer-details.components.scss']
})
export class FarmerDetailsComponent implements OnInit {
  banners = [{
    image: '/images/banner.png',
  }];

  active = 1 ;
  filter = new FilterModel();
  details: FarmerModel;

  constructor(private router: Router,
              private appSevice: AppService,
              private restService: DataService,
              private toastr: ToastrService,
              private activatedRoute: ActivatedRoute
  ) {
  }

  getFarmer() {
    this.restService.getFarmerDetails(this.filter).then((res) => {
      if (res.code === 200) {
        this.details = res.data;
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  search(value) {
    if (value) {
      this.appSevice.keyword = value;
      this.router.navigate(['/products']);
    }
  }

  ngOnInit() {
    scrollTo(0,0);
    this.activatedRoute.params.subscribe(paramsId => {
      this.filter.farmer_id  = paramsId.id;
      this.filter.page  = 0;
      this.getFarmer();
    });
  }

}
