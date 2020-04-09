import { Injectable } from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(public jwtHelper: JwtHelperService , private restService: DataService) {}
  public isAuthenticated(): boolean {

    let toke = localStorage.getItem('auth_token_CrowdMarket') ?  this.jwtHelper.decodeToken(localStorage.getItem('auth_token_CrowdMarket')).email : '' ;
    if(toke){
      return true;
    }
    return false;
  }
}
