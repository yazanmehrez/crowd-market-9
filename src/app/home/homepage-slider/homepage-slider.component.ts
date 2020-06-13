import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BannerModel} from '../../../models/home.model';
import {DataService} from '../../../services/data.service';
import * as $ from 'jquery';
import {Router} from "@angular/router";

@Component({
  selector: 'app-homepage-slider',
  templateUrl: './homepage-slider.component.html',
  styleUrls: ['./homepage-slider.component.scss']
})
export class HomepageSliderComponent implements OnInit {
  @Input() banner: BannerModel[] = [];
  @Input() images: BannerModel[] = [];
  // @Output() search: EventEmitter<string> = new EventEmitter();
  url: string;
  constructor(public restService: DataService,
              private router: Router) {
  }

  ngOnInit() {
    this.url = this.router.url;
  }
}
