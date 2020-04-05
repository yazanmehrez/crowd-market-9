import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../../../services/data.service';
import {AppService} from '../../app.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {UserModel} from '../../../models/user.model';
import {JwtHelperService} from '@auth0/angular-jwt';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {

  verificationForm: FormGroup;
  email: string;

  constructor(private fb: FormBuilder,
              public restService: DataService,
              private appService: AppService,
              private router: Router,
              public jwtHelper: JwtHelperService,
              private toastr: ToastrService) {
  }


  get f() {
    return this.verificationForm.controls;
  }


  prepareForm() {
    this.verificationForm = this.fb.group({
      otp: ['', [Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4)]],
    });
  }


  resendCode() {
    this.email = this.jwtHelper.decodeToken(localStorage.getItem('auth_token_aklbetna')).email;
    let userModel: UserModel = this.verificationForm.value as UserModel;
    userModel.email = this.email;
    this.restService.resendCode(userModel).then((res) => {
      if (res.code === 200) {
        this.toastr.success(res.message, '');
      } else {
        this.toastr.error(res.message, '');
        this.router.navigateByUrl('/login');
      }
    }).catch((err: HttpErrorResponse) => {

    });
  }

  onSubmit() {
    // tslint:disable-next-line:prefer-const
    let userModel: UserModel = this.verificationForm.value as UserModel;
    this.restService.verification(userModel).then((res) => {
      if (res.code === 200) {
        // localStorage.setItem('active', '1');
        this.router.navigateByUrl('/home');
        // this.appService.isActive.next('1');
        // this.appService.isUserLoggedIn.next(localStorage.getItem('auth_token'));
      } else if (res.code === 500) {
        this.router.navigateByUrl('/login');
        this.toastr.error(res.message, '');

      } else {
        this.toastr.error(res.message, '');
      }


      if (res.data.token) {
        localStorage.setItem('auth_token_aklbetna', res.token);
      }

    }).catch((err: HttpErrorResponse) => {

    });
  }

  ngOnInit() {
    this.prepareForm();
  }
}
