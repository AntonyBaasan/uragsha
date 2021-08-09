import { Component, OnDestroy, OnInit } from '@angular/core';
import { SingnallingService } from '../services/signalling.service';
import { WebrtcService } from '../services/webrtc.service';

const SERVICES = [WebrtcService];

@Component({
  selector: 'app-call-page',
  templateUrl: './call-page.component.html',
  styleUrls: ['./call-page.component.scss'],
  providers: [SERVICES],
})
export class CallPageComponent implements OnInit, OnDestroy {
  text: string = 'hello world!';
  room: string = 'test1';

  constructor(private signallingService: SingnallingService, webrtcService: WebrtcService) {}

  ngOnInit(): void {
    this.signallingService.onTextMessage.subscribe((message) =>
      console.log(message)
    );
    this.signallingService.onWebRtcRequest.subscribe((request) =>
      console.log(request)
    );
  }

  ngOnDestroy(): void {
  }

  sendMessage() {
    this.signallingService.sendMessage(this.text);
  }

  joinToRoom() {
    if (this.room) {
      this.signallingService.joinToRoom(this.room);
    }
  }
}
