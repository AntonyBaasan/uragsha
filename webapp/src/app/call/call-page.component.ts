import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SingnallingService } from '../services/signalling.service';
import { WebrtcService } from '../services/webrtc.service';

const SERVICES = [SingnallingService, WebrtcService];

@Component({
  selector: 'app-call-page',
  templateUrl: './call-page.component.html',
  styleUrls: ['./call-page.component.scss'],
  providers: [...SERVICES],
})
export class CallPageComponent implements OnInit, OnDestroy {
  sessionId = '';
  text: string = 'hello world!';

  private subParam: Subscription | undefined;
  private subTextMessage: Subscription | undefined;
  private subWebRtc: Subscription | undefined;
  messages: string[] = [];

  constructor(
    private signallingService: SingnallingService,
    private webrtcService: WebrtcService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subParam = this.route.params.subscribe((params) => {
      this.sessionId = params['sessionId'];
    });
    this.subTextMessage = this.signallingService.onTextMessage.subscribe(
      (message: string) => this.handleTextMessage(message)
    );
    this.subWebRtc = this.signallingService.onWebRtcRequest.subscribe(
      (request) => console.log(request)
    );
  }

  ngOnDestroy() {
    this.subParam?.unsubscribe();
    this.subTextMessage?.unsubscribe();
    this.subWebRtc?.unsubscribe();
  }

  sendMessage() {
    this.signallingService.sendMessage(this.text);
  }

  joinToRoom() {
    if (this.sessionId) {
      this.signallingService.joinToRoom(this.sessionId);
    }
  }

  leave() {
    this.router.navigate(['/']);
  }

  private handleTextMessage(message: string): void {
    this.messages.unshift(message);
  }
}
