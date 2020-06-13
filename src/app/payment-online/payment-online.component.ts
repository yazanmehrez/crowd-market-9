import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../services/data.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AppService} from "../app.service";
import {HttpErrorResponse} from "@angular/common/http";
import {PaginationModel} from "../../models/pagination.model";

@Component({
  selector: 'app-payment-online',
  templateUrl: './payment-online.component.html',
  styleUrls: ['./payment-online.component.scss']
})
export class PaymentOnlineComponent implements OnInit, OnDestroy, AfterViewInit {
  accessToken: string;
  noqodiURL: string;
  app: string;
  @ViewChild('iframe') iframe: ElementRef;

  constructor(private restService: DataService,
              private appService: AppService,
              private router: Router,
              private activatedRoute: ActivatedRoute
  ) {
    this.appService.footerHeader$.next(true);
  }


  ngOnInit(): void {


    this.activatedRoute.params.subscribe(paramsId => {
      // this.noqodiURL = 'https://pay-stg02.noqodi.com/noqodi-payment?paymentRequestToken=' + paramsId.id + '&lang=' + this.appService.currentLanguage;
      this.noqodiURL = 'https://pay.noqodi.com/noqodi-payment?paymentRequestToken=' + paramsId.id + '&lang=' + this.appService.currentLanguage;
    });
  }

  receiveMessage(event) {
    if (event) {
      if (event.origin !== 'https://accounts.google.com') {
        if (event.data) {
          if (typeof (event.data) == 'string') {
            let params = new PaginationModel();
            let data = JSON.parse(event.data);
            params.naqodi_reponse = event.data;
            params.order_id = localStorage.getItem('crowd-order-id');
            if (data.statusInfo.status === 'CANCELLED') {
              this.updatePayment(params);
              setTimeout(() => {
                this.router.navigate(['/checkout']);
              }, 1500);

            } else if (data.statusInfo.status === 'SUCCESS') {
              this.updatePayment(params);
              setTimeout(() => {

                this.router.navigate(['/complete-order']);
              }, 1500);
            }
          }
        }
      }
    }
  }


  updatePayment(params) {
    this.restService.updatePayment(params).then((res) => {
      if (res.code === 200) {
      }
    }).catch((err: HttpErrorResponse) => {
    });
  }

  ngAfterViewInit(): void {
    window.addEventListener("message", ((event) => {
      this.receiveMessage(event);
    }), false);
  }

  ngOnDestroy(): void {
    this.appService.footerHeader$.next(false);
  }

}
