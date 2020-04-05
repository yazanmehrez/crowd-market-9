import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {FormBuilder, FormGroup} from '@angular/forms';
import {KitchenModel} from '../../models/kitchen.model';
import {Category} from '../../models/category';
import {PaginationModel} from '../../models/pagination.model';
import {DataService} from '../../services/data.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute} from '@angular/router';
import {ReviewsModel} from '../../models/reviews.model';

@Component({
  selector: 'app-kitchen',
  templateUrl: './kitchen.component.html',
  styleUrls: ['./kitchen.component.scss']
})
export class KitchenComponent implements OnInit {
  kitchen_id: number;
  details: KitchenModel;

  constructor(public restService: DataService,
              private toastr: ToastrService,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder) {

  }

  getKitchens() {
    this.restService.kitchensDetails(this.kitchen_id).then((res) => {
      if (res.code === 200) {
        this.details = res.data;
      } else {
        this.toastr.error(res.message , '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  ngOnInit() {
    scrollTo(0,0);
    this.activatedRoute.params.subscribe(paramsId => {
      this.kitchen_id = paramsId.id;
      this.getKitchens();
    });

  }


}
