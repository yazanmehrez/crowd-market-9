import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import {FormBuilder} from '@angular/forms';
import {AppService} from '../app.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor(public restService: DataService,
              private fb: FormBuilder,
              private appService: AppService,
              private toastr: ToastrService) {

  }
  ngOnInit() {
  }

}
