import { Injectable } from '@angular/core';
// import { FirebaseApp, initializeApp } from 'firebase/app'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  // public firebaseApp: FirebaseApp;
  constructor() {
    // this.firebaseApp = initializeApp(environment.firebaseConfig);
  }
}
