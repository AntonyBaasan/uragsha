import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { addSeconds, format } from 'date-fns'
import { TimerService } from 'src/app/services/timer.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input()
  set initSeconds(seconds: number) {
    this.initTime = seconds;
    this.timeLeft = seconds;
  }
  @Output() timeDone = new EventEmitter();

  private initTime: number = 0;
  private timeLeft: number = 0;
  private interval: any;

  constructor(private timerService: TimerService, private cdr: ChangeDetectorRef) { }

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
    this.timerService.setTimer('secondCounter', 1000, true, () => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.cdr;
      } else {
        this.timeDone.emit();
        this.stopTimer();
      }
    });
  }

  stopTimer() {
    this.timerService.stopTimer('secondCounter');
  }

  getWidth() {

    const left = 100 * this.timeLeft / this.initTime;
    return { width: `${left}%` }
  }

}
