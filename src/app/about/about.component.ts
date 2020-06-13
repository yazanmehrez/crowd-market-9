import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  data: string;
  constructor(private restService: DataService) { }

  getTerms() {
    this.restService.getTermsPolicy('about').then((res) => {
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
