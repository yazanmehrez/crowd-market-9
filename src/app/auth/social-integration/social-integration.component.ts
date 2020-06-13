import { Component, OnInit } from '@angular/core';
import {AuthService, FacebookLoginProvider, SocialUser} from 'angularx-social-login';
import {HttpErrorResponse} from '@angular/common/http';
import {DataService} from '../../../services/data.service';
import {AppService} from '../../app.service';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-social-integration',
  templateUrl: './social-integration.component.html',
  styleUrls: ['./social-integration.component.scss']
})
export class SocialIntegrationComponent implements OnInit {
  private user: SocialUser;
  private GoogleLoginProvider: any;
  private loggedIn: boolean;



  constructor(    private authService: AuthService,
                  private restService: DataService,
                  private appService: AppService,
                  private router: Router,
                  private toastr: ToastrService,

  ) { }



  onSubmit() {
    // tslint:disable-next-line:prefer-const
    this.restService.register_social(this.user).then((res) => {
      if (res.code === 200) {
        localStorage.setItem('auth_token_CrowdMarket', res.data.token);
        this.appService.isUserLoggedIn.next(res.data.token);
        localStorage.setItem('name', res.data.first_name);
        this.appService.name.next(res.data.first_name);
        this.router.navigateByUrl('/home');

      } else {
        this.toastr.error(res.message, '');

      }

    }).catch((err: HttpErrorResponse) => {

    });
  }


  signInWithGoogle(): void {
    this.authService.signIn(this.GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    let d = this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      if (user) {
        this.onSubmit();
      }
      this.loggedIn = (user != null);
    });

  }

}


