import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {FormBuilder} from '@angular/forms';
import {DataService} from '../../services/data.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from '@angular/router';
import {BannerModel} from '../../models/home.model';
import {Category} from '../../models/category';
import {AppService} from '../app.service';
import {ProductModel} from '../../models/product.model';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    inProgress = true;
    banner: BannerModel[] = [];
    data: Category[] = [];
    details: ProductModel;


    constructor(private fb: FormBuilder,
                public restService: DataService,
                public appSevice: AppService,
                private toastr: ToastrService,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
    }


    search(value) {
        if (value) {
            this.appSevice.keyword = value;
            this.router.navigate(['/products']);
        }
    }


    getHomeContent() {
        // tslint:disable-next-line:prefer-const
        this.restService.home().then((res) => {
                if (res.code === 200) {
                    // this.banner = res.data.Banners;
                    this.banner = [{
                        banner_id: '1' ,
                        description: 'How we work ',
                        image: 'assets/videos/slid1.mp4'
                    }, {
                        banner_id: '2' ,
                        description: 'How we work ',
                        image: 'assets/videos/slid2.mp4'
                    }
                    ];
                    this.data = res.data.categories;
                    this.inProgress = false;
                } else {
                    this.toastr.error(res.message, '');
                    this.inProgress = false;
                }

            }
        ).catch((err: HttpErrorResponse) => {
            this.inProgress = false;
        });
    }


    ngOnInit() {
        this.getHomeContent();
    }

}
