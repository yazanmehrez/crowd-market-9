import {Component, OnInit} from '@angular/core';
import {OrderModel} from '../../../models/order.model';
import {DataService} from '../../../services/data.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MealRateModel, RateModel} from '../../../models/rate.Model';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit {
  data: OrderModel;
  rateForm: FormGroup;

  constructor(public restService: DataService,
              public matDialogRef: MatDialogRef<RateComponent>,
              public dialog: MatDialog,
              private toastr: ToastrService,
              private fb: FormBuilder) {
    this.matDialogRef.disableClose = true;

  }

  get f() {
    return this.rateForm.controls;
  }

  get m() {
    return this.f.meals as FormArray;
  }

  prepareForm() {
    this.rateForm = this.fb.group({
      order_id: [''],
      driver_id: [''],
      driverRate: ['', Validators.required],
      kitchen_id: ['', Validators.required],
      order_pakaging_rate: ['', Validators.required],
      delivery_rate: ['', Validators.required],
      value_rate: ['', Validators.required],
      quality_rate: ['', Validators.required],
      comment: [''],
      meals: this.fb.array([]),
    });

  }

  mealsFormControls(item) {
    // tslint:disable-next-line:prefer-const
    let config = this.fb.group({
      meal_id: [null, [Validators.required]],
      final_rate: [null, [Validators.required]],
    });
    config.controls.meal_id.setValue(item.meal_id);
    this.m.push(config);
  }

  onSubmit(){
    let rateModel: RateModel = this.rateForm.value as RateModel;
    this.restService.addRate(rateModel).then((res) => {
      if (res.code === 200) {
        this.toastr.success(res.message, '');
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });  }


  ngOnInit() {
    this.prepareForm();
    this.f.kitchen_id.setValue(this.data.Kitchen.kitchen_id);
    this.f.order_id.setValue(this.data.order_id);
    this.data.alkebetna_sub_orders.forEach(item => {
      this.mealsFormControls(item);
    });
  }

}
