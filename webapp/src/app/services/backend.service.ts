import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  constructor() { }

  ping() {
    return 'hello world';
  }

}
