export const environment = {
  production: true,
  // webApiUrl: 'https://uragsha-webapi.azurewebsites.net',
  webApiUrl: 'https://uragsha-signalling.azurewebsites.net',
  signallingUrl: 'https://uragsha-signalling.azurewebsites.net',
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
