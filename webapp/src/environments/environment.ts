// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // webApiUrl: 'https://localhost:6001',
  webApiUrl: 'https://localhost:7001',
  signallingUrl: 'https://localhost:7001',
  iceServers: [
    { urls: 'stun:stun.services.mozilla.com' },
    { urls: 'stun:stun.l.google.com:19302' },
  ],
  firebaseConfig: {
    apiKey: 'AIzaSyCn5u0EXpCp9u8WmxAPre4gyM-nGzqq7tY',
    authDomain: 'uragsha-webapp.firebaseapp.com',
    projectId: 'uragsha-webapp',
    storageBucket: 'uragsha-webapp.appspot.com',
    messagingSenderId: '627511575063',
    appId: '1:627511575063:web:754fec234c288fc156d252'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
