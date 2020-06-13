import {Component, OnInit} from '@angular/core';
import {OrderModel} from '../../../models/order.model';
import {DataService} from '../../../services/data.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RateModel} from '../../../models/rate.Model';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AppService} from "../../app.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit {
  data: OrderModel;
  rateForm: FormGroup;
  lang: string;

  constructor(public restService: DataService,
              private appService: AppService,
              public matDialogRef: MatDialogRef<RateComponent>,
              public dialog: MatDialog,
              private translate: TranslateService,
              private toastr: ToastrService,
              private fb: FormBuilder) {
    this.matDialogRef.disableClose = true;

  }

  get f() {
    return this.rateForm.controls;
  }

  get m() {
    return this.f.Products_rates as FormArray;
  }

  prepareForm() {
    this.rateForm = this.fb.group({
      order_id: [''],
      // driver_id: [''],
      // driverRate: ['', Validators.required],
      // farmer_id: ['', Validators.required],
      // delivery_rate: ['', Validators.required],
      // value_rate: ['', Validators.required],
      // quality_rate: ['', Validators.required],
      // comment: [''],
      Products_rates: this.fb.array([]),
    });

  }

  mealsFormControls(item) {
    // tslint:disable-next-line:prefer-const
    let config = this.fb.group({
      product_id: [null, [Validators.required]],
      final_rate: [null, [Validators.required]],
      farmer_id: [null, [Validators.required]],
      // user_id: [null, [Validators.required]],
    });
    config.controls.product_id.setValue(item.product_id);
    config.controls.farmer_id.setValue(item.farmer_id);
    this.m.push(config);
  }

  onSubmit() {
    let rateModel: RateModel = this.rateForm.value as RateModel;
    this.restService.addRate(rateModel).then((res) => {
      if (res.code === 200) {
        this.toastr.success(this.translate.instant('_RateMSG'), '');
        this.matDialogRef.beforeClosed().subscribe(() => this.matDialogRef.close(res.code));
        this.dialog.closeAll();
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }


  ngOnInit() {
    this.prepareForm();
    this.lang = this.appService.currentLanguage === 'en' ? 'ltr' : 'rtl';

    // this.f.farmer_id.setValue(this.data.Farmer.farmer_id);
    this.f.order_id.setValue(this.data.order_id);
    this.data.crowdmarket_sub_orders.forEach(item => {
      this.mealsFormControls(item);
    });
  }

}
