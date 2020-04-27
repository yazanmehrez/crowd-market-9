import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-thankfull',
  templateUrl: './thankfull.component.html',
  styleUrls: ['./thankfull.component.scss']
})
export class THANKFULLComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.scrollTo(0,0);
  }

}
