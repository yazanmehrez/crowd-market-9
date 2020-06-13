import {Component, OnInit} from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {DataService} from "../../services/data.service";
import {TranslateService} from "@ngx-translate/core";
import {FilterModel} from "../../models/filter.model";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  subscripForm: FormGroup;

  constructor(private toast: ToastrService,
              private fb: FormBuilder,
              private restService: DataService,
              private translate: TranslateService
  ) {
  }


  get f() {
    return this.subscripForm.controls;
  }


  subscibe() {
    let filter = new FilterModel();
    filter.email = this.f.email.value;
    this.restService.subscribe(filter).then((res) => {
      if (res.code === 200) {
        this.toast.success(this.translate.instant('_SubscribeMsg'), '');

      } else {
        this.toast.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  prepareForm() {
    this.subscripForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.prepareForm();

  }

}
