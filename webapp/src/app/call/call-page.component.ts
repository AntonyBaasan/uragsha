import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Session, SessionDetail } from '../models';
import { StoreService } from '../services';
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
  connectedToSessionRoom = false;
  sessionRequestId = '';
  sessionDetail: SessionDetail;

  user: any;
  otherUserInfo: any = {};
  text: string = 'hello world!';
  userName: string = 'ant';

  private subParam: Subscription | undefined;
  private subTextMessage: Subscription | undefined;
  private subWebRtc: Subscription | undefined;
  messages: string[] = [];

  constructor(
    private signallingService: SingnallingService,
    private webrtcService: WebrtcService,
    private store: StoreService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userName = this.store.getUserId() ?? this.userName;
    this.subParam = this.route.params.subscribe((params) => {
      this.sessionRequestId = params['sessionRequestId'];
    });
    this.subTextMessage = this.signallingService.onTextMessage.subscribe(
      (message: string) => this.handleTextMessage(message)
    );
    this.subWebRtc = this.signallingService.onWebRtcRequest.subscribe(
      (request) => console.log(request)
    );

    this.signallingService.OnStartOrJoinSession.subscribe(
      (result: {
        sessionId: string;
        status: 'created' | 'joined';
        sessionDetail: SessionDetail;
      }) => this.handleStartOrJoinResult(result)
    );
    this.signallingService.OnSessionDetailUpdated.subscribe(
      (sessionDetail: SessionDetail) => console.log(sessionDetail)
    );
  }

  setUserName() {
    this.store.setUserId(this.userName);
    this.signallingService.setUserName(this.store.getUserId());
  }

  handleStartOrJoinResult(result: {
    sessionId: string;
    status: 'created' | 'joined';
    sessionDetail: SessionDetail;
  }) {
    this.sessionDetail = result.sessionDetail;
    if (result.status === 'created') {
      this.sessionDetail.offer = {
        userId: this.userName,
        content: 'offer data',
      };
      this.signallingService.UpdateSessionDetail(
        this.userName,
        this.sessionDetail
      );
    } else {
      if (!result.sessionDetail.offer) {
        console.log('Weird! Why offer object is empty?');
      } else {
        this.sessionDetail.answer = {
          userId: this.userName,
          content: 'answer data',
        };
        this.signallingService.UpdateSessionDetail(
          this.userName,
          this.sessionDetail
        );
      }
    }
  }

  ngOnDestroy() {
    this.subParam?.unsubscribe();
    this.subTextMessage?.unsubscribe();
    this.subWebRtc?.unsubscribe();
  }

  sendMessage() {
    this.signallingService.sendMessage(this.text);
  }

  startCall() {
    if (this.sessionRequestId) {
      // this.signallingService.joinToRoom(this.sessionRequestId);
      this.signallingService.startOrJoinSession(
        this.store.getUserId(),
        this.sessionRequestId
      );
    }
  }

  leave() {
    this.router.navigate(['/']);
  }

  private handleTextMessage(message: string): void {
    this.messages.unshift(message);
  }
}
