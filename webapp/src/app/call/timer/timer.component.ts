import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { addSeconds, format, intervalToDuration } from 'date-fns'

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input()
  set initSeconds(seconds: number) {
    this.timeLeft = seconds;
  }
  @Output() timeDone = new EventEmitter();


  private timeLeft: number = 0;
  private interval: any;

  constructor() { }

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  secondsToMin(): string {
    if (this.timeLeft) {
      var helperDate = addSeconds(new Date(0), this.timeLeft);
      return format(helperDate, 'mm:ss');
    }
    return 'Empty!';
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeDone.emit();
        this.startTimer();
      }
    }, 1000)
  }

  stopTimer() {
    clearInterval(this.interval);
  }

}
