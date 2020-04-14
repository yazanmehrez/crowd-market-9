import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {DataService} from '../../../services/data.service';
import {AppService} from '../../app.service';
import {MustMatch} from '../../_helpers/must-match.validator';
import {UserModel} from '../../../models/user.model';
import {ToastrService} from 'ngx-toastr';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthService, FacebookLoginProvider, SocialUser} from 'angularx-social-login';
import {Category} from '../../../models/category';
import {Appearance} from '@angular-material-extensions/google-maps-autocomplete';
import {MatDialog} from '@angular/material';
import {CroppedImageComponent} from '../../dialogs/cropped-image/cropped-image.component';
import {ServiceProvider} from '../../../models/ServiceProvider';
import PlaceResult = google.maps.places.PlaceResult;

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
  registerForm: FormGroup;
  kitchenForm: FormGroup;
  categories: Category[] = [];
  allCategories: Category[] = [];
  public appearance = Appearance;
  public zoom: number;
  public latitude: number;
  public longitude: number;
  public location: string;
  start: string;
  end: string;
  private GoogleLoginProvider: any;
  private user: SocialUser;
  private ServiceProvider: ServiceProvider;
  private loggedIn: boolean;

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


  search(value) {
    if (value) {
      this.appService.keyword = value;
      this.router.navigate(['/products']);
    }
  }


  get l() {
    return this.loginForm.controls;
  }


  get f() {
    return this.kitchenForm.controls;
  }

  prepareForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
    });


    this.kitchenForm = this._formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      profile: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^[0-9]+$/)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
      ConfirmPassword: ['', [Validators.required]],
      acceptTerms: ['', Validators.requiredTrue],

      kitchen_id: [null],
      description_en: [null, [Validators.required]],
      description_ar: [null, [Validators.required]],
      featured: [null],
      name_en: [null, [Validators.required]],
      name_ar: [null, [Validators.required]],
      image: [null, [Validators.required]],
      is_delivery: [null],
      category: [null, [Validators.required]],
      category_id: [null, [Validators.required]],
      start_time: [null, [Validators.required]],
      end_time: [null, [Validators.required]],
      lat: [null, [Validators.required]],
      lng: [null, [Validators.required]],
      location: [null, [Validators.required]],
      active: [null],
      busy: [null]
    }, {
      validator: MustMatch('password', 'ConfirmPassword')
    });
  }


  filter() {
    let keyword = this.f.category_id.value;
    if (keyword) {
      this.categories = this.categories.filter(item => item.name.toLowerCase().includes(keyword));
    } else {
      this.categories = this.allCategories;
    }
  }

  getCategoryID(name) {
    let category = this.allCategories.filter(item => item.name === name);
    this.f.category_id.setValue(category[0].category_id);
  }

  changeTime(e, type) {
    if (type === 'start') {
      this.f.start_time.setValue(e.value);

    } else {
      this.f.end_time.setValue(e.value);

    }
  }

  login() {
    // tslint:disable-next-line:prefer-const
    let userModel: UserModel = this.loginForm.value as UserModel;
    this.restService.login(userModel).then((res) => {
      if (res.code === 200) {
        localStorage.setItem('auth_token_CrowdMarket', res.data.token);
        this.appService.isUserLoggedIn.next(res.data.token);

        localStorage.setItem('photo', res.data.profile);
        this.appService.photo.next(res.data.profile);
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

  onLocationSelected(location: Location) {
    console.log('onLocationSelected: ', location);
    // this.f.lat.setValue(location.latitude);
    // this.f.lng.setValue(location.longitude);
  }

  onAutocompleteSelected(result: PlaceResult) {
    console.log('onAutocompleteSelected: ', result);
    this.f.location.setValue(result.formatted_address);
  }

  openDialog(type) {
    let dialog = this.dialog.open(CroppedImageComponent);
    dialog.afterClosed().subscribe(result => {
      this.uploadTextFile(result , type);
    });
  }

  uploadTextFile(file , type) {
    let formData = new FormData();
    formData.append('base64', file);
    console.log(formData.get('base64'));
    this.restService.uploadTextFile(formData).then((res) => {
      if (res.code === 200) {
        if(type == 'profile'){
          this.f.profile.setValue(res.data.url);
        }else{
          this.f.image.setValue(res.data.url);
        }
      } else {
      }
    }).catch((err: HttpErrorResponse) => {
      this.toastr.error('The image is too large', '');
      console.log('The image is too large');

    });
  }

  RegisterSP() {
    // tslint:disable-next-line:prefer-const
    this.f.active.setValue('0');
    this.f.busy.setValue('0');

    let userModel: ServiceProvider = this.kitchenForm.value as ServiceProvider;
    userModel.user_type = 'servicePro';
    this.restService.createSPAccount(userModel).then((res) => {
      if (res.code === 200) {
        this.toastr.success(res.message, '');
        this.kitchenForm.reset();
        Object.keys(this.kitchenForm.controls).forEach(key => {
          this.kitchenForm.controls[key].setErrors(null);
        });
      } else {
        this.toastr.error(res.message, '');
      }

    }).catch((err: HttpErrorResponse) => {

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

  signInWithGoogle(): void {
    this.authService.signIn(this.GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    let d = this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  onSubmit() {
    // tslint:disable-next-line:prefer-const
    // this.user.profile = this.user.photoUrl;
    this.restService.register_social(this.user).then((res) => {
      if (res.code === 200) {
        localStorage.setItem('auth_token_CrowdMarket', res.data.token);
        localStorage.setItem('photoSocial', res.data.profile);
        this.appService.photoSocial.next(res.data.profile);
        this.router.navigateByUrl('/home');

      } else {
        this.toastr.error(res.message, '');

      }

    }).catch((err: HttpErrorResponse) => {

    });
  }

  getCategories() {
    this.restService.getCategories().then((res) => {
      if (res.code === 200) {
        this.categories = res.data;
        this.allCategories = this.categories;

      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  ngOnInit(): void {
    window.scroll(0, 0);
    this.prepareForm();
    this.getCategories();
    this.setCurrentPosition();
    this.authService.authState.subscribe((user) => {
      console.log(user);
      this.user = user;
      if (user) {
        this.onSubmit();
      }
      this.loggedIn = (user != null);
    });

  }

  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

}
