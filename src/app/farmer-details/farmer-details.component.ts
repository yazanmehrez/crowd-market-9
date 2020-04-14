import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AppService} from '../app.service';
import {HttpErrorResponse} from '@angular/common/http';
import {DataService} from '../../services/data.service';
import {ToastrService} from 'ngx-toastr';
import {FilterModel} from '../../models/filter.model';

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
  details: any;
  //
  // details = {
  //   'farmer_id': 2,
  //   'lat': 44,
  //   'lng': 54,
  //   'title': 'Kisan',
  //   'description': 'aboris ex magna ea consectetur dolore ex enim sit in nostrud laborum sunt. Ea pariatur nisi ipsum labore consectetur in officia consectetur incididunt ex sint aliqua deserunt est. Nulla nisi esse et aliqua pariatur cillum velit est anim fugiat velit sit ipsum minim. Nostrud cupidatat ea commodo nisi do ipsum proident consectetur aliqua velit irure. Elit eu ex sint excepteur velit minim. Mollit id esse labore eiusmod ad id.\n                      ',
  //   'active': 1,
  //   'final_rate': 1,
  //   'final_value_rate': 1,
  //   'final_delivery_rate': 1,
  //   'final_quality_rate': 1,
  //   reviews: [{
  //     final_rate: 2,
  //     comment: 'good',
  //     user: {
  //       final_rate: 2,
  //       first_name: 'ghina',
  //       last_name: 'ghina',
  //     }
  //   }]
  // };

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
