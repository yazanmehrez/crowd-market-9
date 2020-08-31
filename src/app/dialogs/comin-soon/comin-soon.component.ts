import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-comin-soon',
  templateUrl: './comin-soon.component.html',
  styleUrls: ['./comin-soon.component.scss']
})
export class CominSoonComponent implements OnInit {

  constructor( public dialog: MatDialog,) { }

  ngOnInit(): void {
  }

}
