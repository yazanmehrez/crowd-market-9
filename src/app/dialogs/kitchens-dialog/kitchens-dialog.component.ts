import {Component, OnInit} from '@angular/core';
import {Category} from '../../../models/category';
import {HttpErrorResponse} from '@angular/common/http';
import {PaginationModel} from '../../../models/pagination.model';
import {DataService} from '../../../services/data.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-kitchens-dialog',
    templateUrl: './kitchens-dialog.component.html',
    styleUrls: ['./kitchens-dialog.component.css']
})
export class KitchensDialogComponent implements OnInit {
    category_id = '';
    kitchens: Category;
    kitchen: string;
    pagination = new PaginationModel();

    constructor(public matDialogRef: MatDialogRef<KitchensDialogComponent>,
                public dialog: MatDialog,
                private restService: DataService) {
        this.matDialogRef.disableClose = true;
    }

    selectKitchen() {
        this.matDialogRef.beforeClosed().subscribe(() => this.matDialogRef.close(this.kitchen));
        this.dialog.closeAll();
    }

    getKitchens(id) {
        this.pagination.id = id;
        this.restService.kitchens(this.pagination).then((res) => {
            if (res.code === 200) {
                this.kitchens = res.data;
            } else {
                // this.toastr.error(res.message, '');
            }
        }).catch((err: HttpErrorResponse) => {
        });
    }

    ngOnInit() {
        this.getKitchens(this.category_id);
    }

}
