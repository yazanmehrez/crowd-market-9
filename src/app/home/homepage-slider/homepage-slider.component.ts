import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BannerModel} from '../../../models/home.model';
import {DataService} from '../../../services/data.service';

@Component({
  selector: 'app-homepage-slider',
  templateUrl: './homepage-slider.component.html',
  styleUrls: ['./homepage-slider.component.scss']
})
export class HomepageSliderComponent implements OnInit {
  @Input() banner: BannerModel[] = [];
  @Output() search: EventEmitter<string> = new EventEmitter();

  constructor(public restService: DataService) {
  }

  ngOnInit() {
  }

  playVideo(event) {
    event.toElement.play();
  }

  getKeyword(value) {
    // if (value) {
      this.search.emit(value);

    // }
  }

}
