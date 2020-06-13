import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor( public matDialogRef: MatDialogRef<WelcomeComponent>,
               public dialog: MatDialog,

  ) {
    this.matDialogRef.disableClose = true;

  }

  ngOnInit(): void {
  }

}
