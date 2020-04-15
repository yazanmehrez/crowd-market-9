import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MustMatch} from '../../_helpers/must-match.validator';
import {AppService} from '../../app.service';
import {DataService} from '../../../services/data.service';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from 'angularx-social-login';
import {MatDialog} from '@angular/material';
import {Router} from '@angular/router';
import {UserModel} from '../../../models/user.model';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  banners = [{
    image: '/images/banner.png',
  }];

  constructor(
    private _formBuilder: FormBuilder,
    private fb: FormBuilder,
    public appService: AppService,
    public restService: DataService,
    private toastr: ToastrService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router) {
  }


  get r() {
    return this.registerForm.controls;
  }


  search(value) {
    if (value) {
      this.appService.keyword = value;
      this.router.navigate(['/products']);
    }
  }

  prepareForm() {
    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^[0-9]+$/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      ConfirmPassword: ['', [Validators.required]],
      acceptTerms: ['', Validators.requiredTrue],
    }, {
      validator: MustMatch('password', 'ConfirmPassword')
    });

  }

  Register() {
    // tslint:disable-next-line:prefer-const
    let userModel: UserModel = this.registerForm.value as UserModel;
    userModel.user_type = 'normal';
    this.restService.register(userModel).then((res) => {
      if (res.code === 200) {
        localStorage.setItem('auth_token_CrowdMarket', res.data.token);
        this.toastr.success(res.message, '');
        setTimeout(() => {
          this.router.navigateByUrl('/verification');
        }, 1500);

        this.registerForm.reset();
        Object.keys(this.registerForm.controls).forEach(key => {
          this.registerForm.controls[key].setErrors(null);
        });
      } else {
        this.toastr.error(res.message, '');
      }

    }).catch((err: HttpErrorResponse) => {

    });
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.prepareForm();
  }

}
