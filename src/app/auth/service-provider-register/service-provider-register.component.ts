import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppService} from '../../app.service';
import {DataService} from '../../../services/data.service';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from 'angularx-social-login';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {MustMatch} from '../../_helpers/must-match.validator';
import {HttpErrorResponse} from '@angular/common/http';
import {ServiceProvider} from '../../../models/ServiceProvider';
import {Appearance} from '@angular-material-extensions/google-maps-autocomplete';
import PlaceResult = google.maps.places.PlaceResult;
import {CroppedImageComponent} from '../../dialogs/cropped-image/cropped-image.component';
import {Category} from '../../../models/category';
import {stringify} from 'querystring';

@Component({
  selector: 'app-service-provider-register',
  templateUrl: './service-provider-register.component.html',
  styleUrls: ['./service-provider-register.component.scss']
})
export class ServiceProviderRegisterComponent implements OnInit {
  banners = [{
    image: '/images/banner.png',
  }];
  providerForm: FormGroup;
  public appearance = Appearance;
  public zoom: number;
  public latitude: number;
  public longitude: number;
  public location: string;
  categories: Category[] = [];
  allCategories: Category[] = [];
  start: string;
  end: string;

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

  get f() {
    return this.providerForm.controls;
  }


  changeTime(e, type) {
    if (type === 'start') {
      this.f.start_time.setValue(e.value);

    } else {
      this.f.end_time.setValue(e.value);

    }
  }

  prepareForm() {
  this.providerForm = this._formBuilder.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    profile: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(10), Validators.pattern(/^[0-9]+$/)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16)]],
    ConfirmPassword: ['', [Validators.required]],
    acceptTerms: ['', Validators.requiredTrue],
    description_en: [null, [Validators.required]],
    description_ar: [null, [Validators.required]],
    featured: [null],
    name_en: [null, [Validators.required]],
    name_ar: [null, [Validators.required]],
    image: [null, [Validators.required]],
    category_id: [null, [Validators.required]],
    lat: [null, [Validators.required]],
    lng: [null, [Validators.required]],
    location: [null, [Validators.required]],
    active: [null],
  }, {
    validator: MustMatch('password', 'ConfirmPassword')
  });
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



  onLocationSelected(location: Location) {
    // console.log('onLocationSelected: ', location);
    let map_location = stringify(location);
    this.f.lat.setValue(map_location.latitude);
    this.f.lng.setValue(map_location.longitude);
  }

  onAutocompleteSelected(result: PlaceResult) {
    this.f.location.setValue(result.formatted_address);
  }

  RegisterSP() {
    // tslint:disable-next-line:prefer-const
    this.f.active.setValue('0');

    let userModel: ServiceProvider = this.providerForm.value as ServiceProvider;
    userModel.user_type = 'servicePro';
    this.restService.createSPAccount(userModel).then((res) => {
      if (res.code === 200) {
        this.toastr.success(res.message, '');
        this.providerForm.reset();
        Object.keys(this.providerForm.controls).forEach(key => {
          this.providerForm.controls[key].setErrors(null);
        });
      } else {
        this.toastr.error(res.message, '');
      }

    }).catch((err: HttpErrorResponse) => {

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

  ngOnInit() {
    window.scroll(0, 0);
    this.prepareForm();
    this.setCurrentPosition();
    this.getCategories();



  }

}
