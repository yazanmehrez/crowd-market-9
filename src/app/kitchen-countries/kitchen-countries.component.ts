import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DataService} from '../../services/data.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {Category} from '../../models/category';
import {AppService} from '../app.service';

@Component({
  selector: 'app-kitchen-countries',
  templateUrl: './kitchen-countries.component.html',
  styleUrls: ['./kitchen-countries.component.scss']
})
export class KitchenCountriesComponent implements OnInit {

  filterForm: FormGroup;
  categories: Category[] = [];
  allCategories: Category[] = [];


  constructor(public restService: DataService,
              private fb: FormBuilder,
              private appService: AppService,
              private toastr: ToastrService) {

  }


  get f() {
    return this.filterForm.controls;
  }

  prepareForm() {
    this.filterForm = this.fb.group({
      keyword: [''],
      location: [''],
    });


  }

  filter() {
    let keyword = this.filterForm.controls.location.value;
    if (keyword) {
      this.categories = this.categories.filter(item => item.name.toLowerCase().includes(keyword));
    } else {
      this.categories = this.allCategories;
    }
  }

  getCategories() {
    this.restService.categories().then((res) => {
      if (res.code === 200) {
        this.categories = res.data;
        this.allCategories = this.categories;

      } else {
        this.toastr.error(res.message , '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }




  ngOnInit() {
    scrollTo(0,0);
    this.appService.active = 2;
    this.prepareForm();
    this.getCategories();

  }

}
