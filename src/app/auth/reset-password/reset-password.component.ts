import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MustMatch} from '../../_helpers/must-match.validator';
import {DataService} from '../../../services/data.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {UserModel} from '../../../models/user.model';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;

  constructor(private fb: FormBuilder,
              public restService: DataService,
              private toastr: ToastrService,
              private router: Router) {
  }


  get f() {
    return this.resetPasswordForm.controls;
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

      localStorage.setItem('auth_token_aklbetna', res.token);

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
    this.prepareForm();

  }

}
