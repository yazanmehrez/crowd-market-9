import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../../../services/data.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {UserModel} from '../../../models/user.model';
import {HttpErrorResponse} from '@angular/common/http';
import {AppService} from '../../app.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  forgetForm: FormGroup;
  banners = [{
    image: '/images/banner.png',
  }];
  lang: string;
  constructor(private fb: FormBuilder,
              private restService: DataService,
              private appService: AppService,
              private toastr: ToastrService,
              private router: Router) {
  }

  search(value) {
    if (value) {
      this.appService.keyword = value;
      this.router.navigate(['/products']);
    }
  }


  get f() {
    return this.forgetForm.controls;
  }

  onSubmit() {
    // tslint:disable-next-line:prefer-const
    let userModel: UserModel = this.forgetForm.value as UserModel;
    this.restService.resendCode(userModel).then((res) => {
      if (res.code === 200) {
        localStorage.setItem('email' , res.data.email);
        this.toastr.success(res.message, '');
        setTimeout(() => {
          this.router.navigateByUrl('/reset-password');
        }, 1500);
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {

    });
  }


  prepareForm() {
    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    window.scroll(0, 0);

    this.prepareForm();
    this.lang = this.appService.currentLanguage === 'en' ? 'ltr' : 'rtl';

  }

}
