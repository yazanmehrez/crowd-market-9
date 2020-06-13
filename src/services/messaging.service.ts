import {Injectable} from '@angular/core';
import {AngularFireMessaging} from '@angular/fire/messaging';
import {BehaviorSubject} from 'rxjs';
import {HttpErrorResponse} from "@angular/common/http";
import {DataService} from "./data.service";
import {PaginationModel} from "../models/pagination.model";

@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);

  constructor(private angularFireMessaging: AngularFireMessaging,
              private restService: DataService) {

    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
        _messaging.usePublicVapidKey('BHeK5rAfT0o-XjDmOMEFdNKa-fqzyygoqzpNw6anWRSTT_WB5_2kTNRxDKjL3g3ZzSi__H39tcK6LeLg6i2mWbg');
      }
    );
  }

  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        let pagination = new PaginationModel();
        pagination.fcm = token;
        this.restService.updateFCM(pagination).then((res) => {
        }).catch((err: HttpErrorResponse) => {
        });
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        // console.log('new message received. ', payload);
        this.currentMessage.next(payload);
      });
  }

}
