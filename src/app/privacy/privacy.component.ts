import { Component, OnInit } from '@angular/core';
import {DataService} from '../../services/data.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {
  data: string
  constructor(private restService: DataService) {
  }


  getTerms() {
    this.restService.getTermsPolicy('privicy').then((res) => {
      if (res.code === 200) {
        this.data = res.data.details;
      } else {

      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  ngOnInit(): void {
    this.getTerms();
  }



}
