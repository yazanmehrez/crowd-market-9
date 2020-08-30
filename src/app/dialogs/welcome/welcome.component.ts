import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {AppService} from "../../app.service";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  data: string;

  constructor(public matDialogRef: MatDialogRef<WelcomeComponent>,
              public dialog: MatDialog,
              public appService: AppService
  ) {
    this.matDialogRef.disableClose = true;

  }

  ngOnInit(): void {
  }

}
