import { Injectable } from '@angular/core';
import { addSeconds, format } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {

  convertSecondsToMin(seconds: number): string {
    return this.formattedTime(seconds);
  }

  // TODO: move to shared service
  private formattedTime(seconds: number) {
    var helperDate = addSeconds(new Date(0), seconds);
    return format(helperDate, 'mm:ss');
  }
}
