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

  localStream: MediaStream | null;
  remoteStream: MediaStream | null;

  private subOnOfferVideoCall: Subscription | undefined;
  private subOnAnswerVideoCall: Subscription | undefined;
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
    this.subOnOfferVideoCall = this.signallingService.OnOfferVideoCall.subscribe(
      (result: {
        sessionId: string;
        sessionDetail: SessionDetail;
      }) => this.handleOfferVideoCall(result)
    );
    this.subOnAnswerVideoCall = this.signallingService.OnAnswerVideoCall.subscribe(
      (result: {
        sessionId: string;
        sessionDetail: SessionDetail;
      }) => this.handleAnswerVideoCall(result)
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
    this.webRtcService.init();
    this.webRtcService.remoteStreamAddedSubject.subscribe(stream => {
      this.remoteStream = stream;
      // console.log(remoteStream);
    });
    this.webRtcService.iceCandidateEventSubject.subscribe(candidate => {
      // signalingChannel.send({ 'new-ice-candidate': event.candidate });
      if (this.sessionDetail) {
        this.signallingService.SendIceCandidate(
          this.sessionDetail.sessionId,
          candidate
        );
      }
    });
  }

  showMe() {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        this.localStream = stream;
        this.webRtcService.addStream(this.localStream);
      });
  }

  stop() {
    this.localStream = null;
    this.remoteStream = null;
    this.webRtcService.ngOnDestroy();
  }

  // came from a user who started video
  // so this user has to create answer
  async handleOfferVideoCall(result: {
    sessionId: string;
    sessionDetail: SessionDetail;
  }) {

    if (!result.sessionDetail.offer) {
      console.error('Weird! Why offer object is empty?');
      return;
    }

    this.sessionDetail = result.sessionDetail;
    this.webRtcService.setRemoteDescription(this.sessionDetail.offer.content);
    const answer = await this.webRtcService.createAnswer();

    this.signallingService.answerVideoCall(
      this.sessionRequestId,
      answer
    );

  }
  // came from a user who started video
  // so this user has to create answer
  async handleAnswerVideoCall(result: {
    sessionId: string;
    sessionDetail: SessionDetail;
  }) {
    this.sessionDetail = result.sessionDetail;
    if (this.sessionDetail.answer) {
      this.webRtcService.setRemoteDescription(this.sessionDetail.answer.content);
    }
  }

  private async handleSessionDetailUpdated(sessionDetail: SessionDetail) {
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
    this.subOnOfferVideoCall?.unsubscribe();
    this.subOnAnswerVideoCall?.unsubscribe();
    this.subOnSessionDetailUpdated?.unsubscribe();
    this.subOnReceiveIceCandidate?.unsubscribe();
    this.subOnUserJoinSession?.unsubscribe();
    this.subOnUserLeaveSession?.unsubscribe();
  }

  async startCall() {
    if (this.sessionDetail?.offer) {
      console.log('Video call is already in progress!')
      return;
    }
    const user = this.store.getUser();
    if (this.sessionRequestId && user) {
      const offer = await this.webRtcService.createOffer();
      this.signallingService.offerVideoCall(
        this.sessionRequestId,
        offer
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
