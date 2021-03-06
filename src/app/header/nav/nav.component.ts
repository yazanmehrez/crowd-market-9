import {Component, Input, OnInit} from '@angular/core';
import {Category} from '../../../models/category';
import {DataService} from '../../../services/data.service';
import {AppService} from '../../app.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {WelcomeComponent} from "../../dialogs/welcome/welcome.component";
import {CominSoonComponent} from "../../dialogs/comin-soon/comin-soon.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  @Input() categories: Category[];
  offers: Category[] = [];
  searchForm: FormGroup;
  recently: string[] = [];
  recentlyList: string[] = [];
  open = true;

  constructor(public restService: DataService,
              public _appService: AppService,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private activatedRoute: ActivatedRoute,
              private router: Router
  ) {
  }

  get f() {
    return this.searchForm.controls;
  }

  getKeyword() {
    this.open = false;
    this._appService.keyword.next({type: 'search', value: this.f.search.value});
    if (this.f.search.value) {
      this.recentlyList.push(this.f.search.value);
      localStorage.setItem('recently-search', JSON.stringify(this.recentlyList));
      this.recently = localStorage.getItem('recently-search') ? JSON.parse(localStorage.getItem('recently-search')).reverse() : [];

    }

    this.router.navigate(['/products/0']);

  }

  getCategory(item: Category) {
    this.f.search.setValue('');
    this._appService.keyword.next({type: 'category', value: item.category_id});
  }

  prepareForm() {
    this.searchForm = this.fb.group({
      search: [''],
    });
  }


  clearKeyword() {
    if (this.f.search.value === '') {
      this._appService.keyword.next({type: 'search', value: ''});
    } else {
      this.open = true;
    }
  }


  openDialog(){
    let dialogRef = this.dialog.open(CominSoonComponent);

  }

  getOffers() {
    this.restService.deals().then((res) => {
      if (res.code === 200) {
        this.offers = res.data;
      } else {
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  ngOnInit(): void {
    this.prepareForm();
    this.getOffers();
    this.recently = localStorage.getItem('recently-search') ? JSON.parse(localStorage.getItem('recently-search')).reverse() : [];
    this.recentlyList = localStorage.getItem('recently-search') ? JSON.parse(localStorage.getItem('recently-search')) : [];
  }

}
