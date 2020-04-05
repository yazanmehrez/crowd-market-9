import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DataService} from '../../../services/data.service';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {UserModel} from '../../../models/user.model';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  forgetForm: FormGroup;

  constructor(private fb: FormBuilder,
              private restService: DataService,
              private toastr: ToastrService,
              private router: Router) {
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
    this.prepareForm();

  }

}
