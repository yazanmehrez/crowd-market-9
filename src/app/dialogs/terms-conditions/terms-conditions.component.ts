import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DataService} from '../../../services/data.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
    selector: 'app-terms-conditions',
    templateUrl: './terms-conditions.component.html',
    styleUrls: ['./terms-conditions.component.scss']
})
export class TermsConditionsComponent implements OnInit {
    data: string;
     id: string;
    constructor(public matDialogRef: MatDialogRef<TermsConditionsComponent>,
                public dialog: MatDialog,
                private restService: DataService) {
        this.matDialogRef.disableClose = true;

    }


    getTerms() {
        this.restService.getTermsPolicy(this.id).then((res) => {
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
