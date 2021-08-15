import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  private subOnStartOrJoinSession: Subscription | undefined;
  private subOnSessionDetailUpdated: Subscription | undefined;
  private subOnReceiveIceCandidate: Subscription | undefined;
  messages: string[] = [];

  private webRtcConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };
  private peerConnection = new RTCPeerConnection(this.webRtcConfiguration);
  @ViewChild('me') me: any;
  @ViewChild('remote') remote: any;
  private localStream: MediaStream;

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

    this.subOnStartOrJoinSession = this.signallingService.OnStartOrJoinSession.subscribe(
      (result: {
        sessionId: string;
        status: 'created' | 'joined';
        sessionDetail: SessionDetail;
      }) => this.handleStartOrJoinResult(result)
    );
    this.subOnSessionDetailUpdated = this.signallingService.OnSessionDetailUpdated.subscribe(
      (sessionDetail: SessionDetail) =>
        this.handleSessionDetailUpdated(sessionDetail)
    );
    this.subOnReceiveIceCandidate = this.signallingService.OnReceiveIceCandidate.subscribe(
      (iceCandidate: any) => this.handleReceiveIceCandidate(iceCandidate)
    );

    this.peerConnection.addEventListener('icecandidate', (event) => {
      if (event.candidate) {
        // signalingChannel.send({ 'new-ice-candidate': event.candidate });
        if (this.sessionDetail) {
          this.signallingService.SendIceCandidate(
            this.userName,
            this.sessionDetail.sessionId,
            event.candidate
          );
        }
      }
    });
    // remote stream was added, so start listen
    this.peerConnection.addEventListener('track', (event) => {
      this.remote.nativeElement.srcObject = event.streams[0];
    });

    this.showMe();
  }

  setUserName() {
    this.store.setUserId(this.userName);
    this.signallingService.setUserName(this.store.getUserId());
  }

  showMe() {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => (this.me.nativeElement.srcObject = stream))
      .then((stream) => {
        (this.peerConnection as any).addStream(stream);
        this.localStream = stream;
      });
  }

  async handleStartOrJoinResult(result: {
    sessionId: string;
    status: 'created' | 'joined';
    sessionDetail: SessionDetail;
  }) {
    let updatedSessionDetail: SessionDetail;
    if (result.status === 'created') {
      updatedSessionDetail = await this.createOffer(result.sessionDetail);
    } else {
      updatedSessionDetail = await this.createAnswer(result.sessionDetail);
    }
    this.signallingService.UpdateSessionDetail(
      this.userName,
      updatedSessionDetail
    );
    this.sessionDetail = updatedSessionDetail;
  }

  private async createOffer(sessionDetail: SessionDetail) {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    sessionDetail.offer = {
      userId: this.userName,
      content: offer,
    };
    return sessionDetail;
  }

  private async createAnswer(sessionDetail: SessionDetail) {
    if (!sessionDetail.offer) {
      console.log('Weird! Why offer object is empty?');
    } else {
      this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(sessionDetail.offer.content)
      );
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      sessionDetail.answer = {
        userId: this.userName,
        content: answer,
      };
    }
    return sessionDetail;
  }

  private async handleSessionDetailUpdated(sessionDetail: SessionDetail) {
    if (sessionDetail.answer) {
      const remoteDesc = new RTCSessionDescription(
        sessionDetail.answer.content
      );
      await this.peerConnection.setRemoteDescription(remoteDesc);
    }
  }

  private async handleReceiveIceCandidate(iceCandidate: any) {
    try {
      await this.peerConnection.addIceCandidate(iceCandidate);
    } catch (e) {
      console.error('Error adding received ice candidate', e);
    }
  }

  ngOnDestroy() {
    this.peerConnection.close();
    this.subParam?.unsubscribe();
    this.subTextMessage?.unsubscribe();
    this.subWebRtc?.unsubscribe();
    this.subOnStartOrJoinSession?.unsubscribe();
    this.subOnSessionDetailUpdated?.unsubscribe();
    this.subOnReceiveIceCandidate?.unsubscribe();

  }

  sendMessage() {
    this.signallingService.sendMessage(this.text);
  }

  startCall() {
    if (this.sessionRequestId) {
      this.signallingService.startOrJoinSession(
        this.store.getUserId(),
        this.sessionRequestId
      );
    }
  }

  endCall() {
    if (this.sessionDetail) {
      this.signallingService.leaveSession(
        this.store.getUserId(),
        this.sessionDetail.sessionId
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
