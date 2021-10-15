import { Injectable, OnDestroy } from '@angular/core';

@Injectable()
export class TimerService implements OnDestroy {

  private handles: { [name: string]: { type: 'interval' | 'timeout', ref: NodeJS.Timeout } } = {};

  constructor() { }

  ngOnDestroy(): void {
    this.stopAll();
  }

  // time is in milliseconds
  setTimer(name: string, time: number, repeat: boolean, callback: () => void) {
    if (this.handles[name]) {
      this.stopTimer(name);
    }
    if (repeat) {
      this.interval(name, callback, time);
    } else {
      this.timeout(name, callback, time);
    }
  }

  stopAll() {
    for (const [key, _] of Object.entries(this.handles)) {
      this.stopTimer(key);
    }
  }

  stopTimer(name: string) {
    const handle = this.handles[name];
    if (handle) {
      if (handle.type === 'interval') {
        clearInterval(handle.ref);
      } else {
        clearTimeout(handle.ref);
      }
      delete this.handles[name];
    }
  }

  private timeout(name: string, callback: () => void, time: number): void {
    const ref = setTimeout(callback, time);
    this.handles[name] = { type: 'interval', ref: ref };
  }

  private interval(name: string, callback: () => void, time: number): void {
    const ref = setInterval(callback, time);
    this.handles[name] = { type: 'interval', ref: ref };
  }

}
