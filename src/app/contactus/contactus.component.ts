import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AppService} from '../app.service';
import {DataService} from '../../services/data.service';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {ContactModel} from '../../models/category';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})
export class ContactusComponent implements OnInit {
  banners = [{
    image: '/images/banner.png',
    description: 'Contact US'
  }];

  contactForm: FormGroup;
  public zoom: number;
  public latitude: number;
  public longitude: number;
  public location: string;

  constructor(private router: Router,
              private appSevice: AppService,
              private restService: DataService,
              private fb: FormBuilder,
              private toastr: ToastrService,
  ) {
  }

  get f() {
    return this.contactForm.controls;
  }

  search(value) {
    if (value) {
      this.appSevice.keyword = value;
      this.router.navigate(['/products']);
    }
  }

  onSubmit() {
    let model: ContactModel = this.contactForm.value as ContactModel;
    this.restService.complain(model).then((res) => {
      if (res.code === 200) {
        this.toastr.success(res.message, '');

      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  prepareForm() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required]],
    });
  }

  onUpload(fileInput) {
    let fileData = <File>fileInput.target.files[0];
    let formData = new FormData();
    formData.append('mp4', fileData);
    this.restService.uploadVideo(formData).then((res) => {
    });
  }


  ngOnInit() {
    this.prepareForm();
    this.setCurrentPosition();

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
