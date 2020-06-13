import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MustMatch} from '../../_helpers/must-match.validator';
import {DataService} from '../../../services/data.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {UserModel} from '../../../models/user.model';
import {HttpErrorResponse} from '@angular/common/http';
import {AppService} from '../../app.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  banners = [{
    image: '/images/banner.png',
  }];
  lang: string;
  constructor(private fb: FormBuilder,
              public restService: DataService,
              public appService: AppService,
              private toastr: ToastrService,
              private router: Router) {
  }


  get f() {
    return this.resetPasswordForm.controls;
  }


  search(value) {
    if (value) {
      this.appService.keyword = value;
      this.router.navigate(['/products']);
    }
  }



  onSubmit() {
    // tslint:disable-next-line:prefer-const
    let userModel: UserModel = this.resetPasswordForm.value as UserModel;
    userModel.email = localStorage.getItem('email');

    this.restService.resetPassword(userModel).then((res) => {
      if (res.code === 200) {

        this.toastr.success(res.message, '');
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        });
      } else {
        this.toastr.error(res.message, '');
      }

      localStorage.setItem('auth_token_CrowdMarket', res.token);

    }).catch((err: HttpErrorResponse) => {

    });
  }

  prepareForm() {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      confirmPassword: ['', Validators.required],
      email: [''],
      otp: ['', [Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4)]],

    }, {
      validator: MustMatch('password', 'confirmPassword')
    });

  }

  ngOnInit() {
    window.scroll(0, 0);

    this.prepareForm();
    this.lang = this.appService.currentLanguage === 'en' ? 'ltr' : 'rtl';


  }

}
