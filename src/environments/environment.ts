// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://195.229.192.170:3300' ,
  // baseUrl: 'http://102.168.21.97:3100' ,
  firebase: {
    apiKey: "AIzaSyAVMIjpZdOi5cdKCng-OG5caFEu8ilDjBc",
    authDomain: "alkbetna.firebaseapp.com",
    databaseURL: "https://alkbetna.firebaseio.com",
    projectId: "alkbetna",
    storageBucket: "alkbetna.appspot.com",
    messagingSenderId: "354152514713",
    appId: "1:354152514713:web:cd6032b7fa4dfb17c32408",
    measurementId: "G-8CFZQWBXYN"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
