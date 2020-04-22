import {Component, Input, OnInit} from '@angular/core';
import {Category} from '../../../models/category';
import {DataService} from '../../../services/data.service';
import {AppService} from '../../app.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
    @Input() categories: Category[];

    constructor(public restService: DataService, public _appService: AppService) {
    }

    ngOnInit(): void {
    }

}
