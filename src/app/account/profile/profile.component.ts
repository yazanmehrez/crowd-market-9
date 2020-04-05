import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {DataService} from '../../../services/data.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {UserModel} from '../../../models/user.model';
import {MustMatch} from '../../_helpers/must-match.validator';
import {MatDialog} from '@angular/material';
import {CroppedImageComponent} from '../../dialogs/cropped-image/cropped-image.component';
import {PaginationModel} from '../../../models/pagination.model';
import {AppService} from '../../app.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: UserModel;
  registerForm: FormGroup;

  constructor(public restService: DataService,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private appService: AppService,
              private toastr: ToastrService) {

  }

  get r() {
    return this.registerForm.controls;
  }

  onSubmit() {
    // tslint:disable-next-line:prefer-const
    let userModel: UserModel = this.registerForm.value as UserModel;
    if (userModel.password == '' && userModel.currentPassword == '' || userModel.password != '' && userModel.currentPassword != '') {
      this.restService.editProfile(userModel).then((res) => {
        if (res.code === 200) {
          this.appService.photo.next(res.data.profile);
          localStorage.setItem('photo' , res.data.profile);
          this.toastr.success(res.message, '');
        } else {
          this.toastr.error(res.message, '');
        }

      }).catch((err: HttpErrorResponse) => {

      });
    } else {
      this.toastr.error('Please enter new password');
    }
  }

  getProfile() {
    this.restService.getProfile().then((res) => {
      const user: UserModel = res.data as UserModel;
      if (res.code === 200) {
        this.registerForm.patchValue(res.data);
      } else {
        this.toastr.error(res.message, '');
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  openDialogImage() {
    let dialogRef = this.dialog.open(CroppedImageComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.uploadFile(result);
    });

  }



  uploadFile(file) {
    let p = new PaginationModel();
    p.image = file
    this.restService.uploadFile(p).then((res) => {
      if (res.code === 200) {
        this.r.profile.setValue(res.data.url);
      } else {
        this.toastr.error(res.message, '');
      } 
    }).catch((err: HttpErrorResponse) => {
      this.toastr.error('The image is too large' , '');
      console.log('The image is too large');

    });
  }


  prepareForm() {
    this.registerForm = this.fb.group({
      first_name: ['', Validators.required],
      profile: [''],
      last_name: ['', Validators.required],
      email: ['' ,[Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.minLength(8), Validators.maxLength(16)]],
      ConfirmPassword: [''],
      currentPassword:['', [Validators.minLength(8), Validators.maxLength(16)]],
    }, {
      validator: MustMatch('password', 'ConfirmPassword')
    });
  }


  ngOnInit() {
    this.getProfile();
    this.prepareForm();

  }

}
