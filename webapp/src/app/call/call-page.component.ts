import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SessionDetail } from '../models';
import { StoreService } from '../services';
import { SingnallingService } from '../services/signalling.service';
import { WebrtcService } from '../services/webrtc.service';

const SERVICES = [WebrtcService];

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

  otherUserInfo: any = {};
  userId: string = '';

  localStreams: MediaStreamTrack[] = [];
  remoteStreams: MediaStreamTrack[] = [];

  private subOnStartVideoCall: Subscription | undefined;
  private subOnSessionDetailUpdated: Subscription | undefined;
  private subOnReceiveIceCandidate: Subscription | undefined;
  private subOnUserJoinSession: Subscription | undefined;
  private subOnUserLeaveSession: Subscription | undefined;

  constructor(
    private signallingService: SingnallingService,
    private webRtcService: WebrtcService,
    private store: StoreService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.sessionRequestId = this.route.snapshot.params['sessionRequestId'];

    this.store.userSubject.subscribe(user => {
      this.userId = user && user.uid ? user.uid : '';
      this.signallingService.joinSession(this.sessionRequestId);
      this.cdr.detectChanges();
    });

    this.listenSignallingServiceEvents();
    this.listenWebRtcServiceEvents();
  };

  private listenSignallingServiceEvents() {
    this.subOnStartVideoCall = this.signallingService.OnStartVideoCall.subscribe(
      (result: {
        sessionId: string;
        status: 'offer' | 'answer';
        sessionDetail: SessionDetail;
      }) => this.handleStartOrJoinResult(result)
    );
    this.subOnSessionDetailUpdated = this.signallingService.OnSessionDetailUpdated.subscribe(
      (sessionDetail: SessionDetail) => this.handleSessionDetailUpdated(sessionDetail)
    );
    this.subOnReceiveIceCandidate = this.signallingService.OnReceiveIceCandidate.subscribe(
      (iceCandidate: RTCIceCandidate) => this.handleReceiveIceCandidate(iceCandidate)
    );
    this.subOnUserJoinSession = this.signallingService.OnUserJoinSession.subscribe(
      (joinedUserId: string) => this.handleUserJoinSession(joinedUserId)
    );
    this.subOnUserLeaveSession = this.signallingService.OnUserLeaveSesson.subscribe(
      (leftUserId: string) => this.handleUserLeaveSession(leftUserId)
    );
  }

  private listenWebRtcServiceEvents() {
    this.webRtcService.remoteStreamAddedSubject.subscribe(remoteStream => {
      // this.remote.nativeElement.srcObject = event.streams[0];
      console.log(remoteStream);
    });
    this.webRtcService.iceCandidateEventSubject.subscribe(candidate => {
      // signalingChannel.send({ 'new-ice-candidate': event.candidate });
      this.signallingService.SendIceCandidate(
        this.sessionDetail.sessionId,
        candidate
      );
    });
  }

  showMe() {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        this.localStreams = stream.getTracks();
        this.webRtcService.addTrack(this.localStreams);
      });
  }

  stop() {
    this.localStreams = [];
    this.remoteStreams = [];
    this.webRtcService.ngOnDestroy();
  }

  async handleStartOrJoinResult(result: {
    sessionId: string;
    status: 'offer' | 'answer';
    sessionDetail: SessionDetail;
  }) {
    let updatedSessionDetail: SessionDetail;
    if (result.status === 'offer') {
      updatedSessionDetail = await this.createOffer(result.sessionDetail);
    } else {
      updatedSessionDetail = await this.createAnswer(result.sessionDetail);
    }

    this.signallingService.UpdateSessionDetail(
      this.userId,
      updatedSessionDetail
    );

    this.sessionDetail = updatedSessionDetail;
  }

  private async createOffer(sessionDetail: SessionDetail) {
    const offer = await this.webRtcService.createOffer();

    sessionDetail.offer = {
      userId: this.userId,
      content: offer,
    };
    return sessionDetail;
  }

  private async createAnswer(sessionDetail: SessionDetail) {
    if (!sessionDetail.offer) {
      console.log('Weird! Why offer object is empty?');
    } else {
      this.webRtcService.setRemoteDescription(sessionDetail.offer.content);
      const answer = await this.webRtcService.createAnswer();
      sessionDetail.answer = {
        userId: this.userId,
        content: answer,
      };
    }
    return sessionDetail;
  }

  private async handleSessionDetailUpdated(sessionDetail: SessionDetail) {
    if (sessionDetail.answer) {
      this.webRtcService.setRemoteDescription(sessionDetail.answer.content);
    }
    this.sessionDetail = sessionDetail;
  }

  private async handleReceiveIceCandidate(iceCandidate: RTCIceCandidate) {
    try {
      await this.webRtcService.addIceCandidate(iceCandidate)
    } catch (e) {
      console.error('Error adding received ice candidate', e);
    }
  }

  private handleUserJoinSession(joinedUserId: string): void {
    if (this.userId === joinedUserId) {

    } else {
      // other user joined this session
      // TODO: start video call
      console.log('joinedUserId:', joinedUserId);
    }
  }

  private handleUserLeaveSession(leftUserId: string): void {
    if (this.userId === leftUserId) {

    } else {
      // other user left this session
      this.stop();
    }
  }

  ngOnDestroy() {
    this.subOnStartVideoCall?.unsubscribe();
    this.subOnSessionDetailUpdated?.unsubscribe();
    this.subOnReceiveIceCandidate?.unsubscribe();
    this.subOnUserJoinSession?.unsubscribe();
    this.subOnUserLeaveSession?.unsubscribe();
  }

  startCall() {
    const user = this.store.getUser();
    if (this.sessionRequestId && user) {
      this.signallingService.startVideoCall(
        this.sessionRequestId
      );
    }
  }

  endCall() {
    const user = this.store.getUser();
    if (this.sessionDetail && user) {
      this.signallingService.leaveSession(
        this.sessionDetail.sessionId
      );
    }
  }

  leave() {
    this.router.navigate(['/']);
  }

}
