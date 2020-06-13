importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');
firebase.initializeApp({
  apiKey: "AIzaSyCC3RzPDYmozMW7FcKAqntkBjKeJyjY84k",
  authDomain: "crowd-market.firebaseapp.com",
  databaseURL: "https://crowd-market.firebaseio.com",
  projectId: "crowd-market",
  storageBucket: "crowd-market.appspot.com",
  messagingSenderId: "1054312761522",
  appId: "1:1054312761522:web:b91410f2edd3d6211861ab",
  measurementId: "G-NE780DP4LB"
});
firebase.messaging();
