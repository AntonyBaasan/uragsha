import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SignalRService } from '../services/signlar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  message: string;
  received: string[] = [];

  constructor(
    private signalRService: SignalRService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.signalRService.startConnection();
    this.signalRService.messageSubject.subscribe(message => {
      this.received.unshift(message);
      this.cdr.detectChanges();
    });
  }

  sendMessage() {
    console.log(this.message);
    this.signalRService.sendMessage(this.message);

  }
}
