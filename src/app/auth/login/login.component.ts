import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {DataService} from '../../../services/data.service';
import {AppService} from '../../app.service';
import {UserModel} from '../../../models/user.model';
import {ToastrService} from 'ngx-toastr';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthService} from 'angularx-social-login';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],

})
export class LoginComponent implements OnInit {
    banners = [{
        image: '/images/banner.png',
    }];
    loginForm: FormGroup;


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

    get l() {
        return this.loginForm.controls;
    }

    search(value) {
        if (value) {
            this.appService.keyword = value;
            this.router.navigate(['/products']);
        }
    }

    prepareForm() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
        });
    }


    login() {
        // tslint:disable-next-line:prefer-const
        let userModel: UserModel = this.loginForm.value as UserModel;
        this.restService.login(userModel).then((res) => {
            if (res.code === 200) {
                localStorage.setItem('auth_token_CrowdMarket', res.data.token);
                this.appService.isUserLoggedIn.next(res.data.token);

                localStorage.setItem('name', res.data.first_name);
                this.appService.name.next(res.data.first_name);
                this.router.navigateByUrl('/home');
            } else if (res.code === -3) {
                this.toastr.error(res.message, '');
                localStorage.setItem('auth_token_CrowdMarket', res.data.token);
                setTimeout(() => {
                    this.router.navigateByUrl('/verification');
                }, 500);
            } else {
                this.toastr.error(res.message, '');
            }
        }).catch((err: HttpErrorResponse) => {

        });
    }


    ngOnInit(): void {
        window.scroll(0, 0);
        this.prepareForm();

    }


}
