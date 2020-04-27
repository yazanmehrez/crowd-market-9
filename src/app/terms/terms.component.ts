import {Component, OnInit} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {DataService} from '../../services/data.service';

@Component({
    selector: 'app-terms',
    templateUrl: './terms.component.html',
    styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {
    data: string;
    constructor(private restService: DataService) {
    }


    getTerms() {
        this.restService.getTermsPolicy('terms').then((res) => {
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
