import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SingnallingService } from 'src/app/services';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {

  messages: string[] = [];
  text: string = 'hello world!';
  private subTextMessage: Subscription | undefined;

  constructor(private signallingService: SingnallingService) { }

  ngOnInit(): void {
    this.subTextMessage = this.signallingService.onTextMessage.subscribe(
      (message: string) => this.handleTextMessage(message)
    );
  }

  ngOnDestroy(): void {
    this.subTextMessage?.unsubscribe()
  }

  private handleTextMessage(message: string): void {
    this.messages.unshift(message);
  }

  sendMessage() {
    this.signallingService.sendMessage(this.text);
  }

}
