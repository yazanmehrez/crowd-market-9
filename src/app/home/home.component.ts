import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {DataService} from '../../services/data.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {BannerModel} from '../../models/home.model';
import {Category} from '../../models/category';
import {AppService} from '../app.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  banner: BannerModel[] = [];
  data: Category[] = [];


  constructor(private fb: FormBuilder,
              public restService: DataService,
              public appSevice: AppService,
              private toastr: ToastrService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }


  search(value) {
    if(value){
      this.appSevice.keyword = value;
      this.router.navigate(['/products']);
    }
  }


  getHomeContent() {
    // tslint:disable-next-line:prefer-const
    this.restService.home().then((res) => {
      if (res.code === 200) {
        this.banner = res.data.Banners;
        this.data = res.data.categories;


      } else {
        this.toastr.error(res.message, '');
      }

    }).catch((err: HttpErrorResponse) => {

    });
  }


  ngOnInit() {
    this.getHomeContent();
  }

}
