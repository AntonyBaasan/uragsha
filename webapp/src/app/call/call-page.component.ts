import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SessionDetail } from '../models';
import { StoreService } from '../services';
import { SingnallingService } from '../services/signalling.service';
import { WebrtcService } from '../services/webrtc.service';
import { VideoComponent } from './video/video.component';

const SERVICES = [WebrtcService];

@Component({
  selector: 'app-call-page',
  templateUrl: './call-page.component.html',
  styleUrls: ['./call-page.component.scss'],
  providers: [...SERVICES],
})
export class CallPageComponent implements OnInit, OnDestroy {
  @ViewChild(VideoComponent) videoComponent: VideoComponent;

  orientation: 'horizontal' | 'vertical' = 'horizontal';
  connectedToSessionRoom = false;
  sessionRequestId = '';
  sessionDetail: SessionDetail;
  connectionState: RTCPeerConnectionState;

  otherUserInfo: any = {};
  userId: string = '';
  secondsLeft: number = 1800; // 30min

  private subOnSessionDetailUpdated: Subscription | undefined;
  private subOnUserJoinSession: Subscription | undefined;
  private subOnUserLeaveSession: Subscription | undefined;
  private subOnConnectionStateChangedSubject: Subscription | undefined;
  private subOnOfferVideoCall: Subscription | undefined;
  private subOnAnswerVideoCall: Subscription | undefined;
  private subOnReceiveIceCandidate: Subscription | undefined;

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
      // try to join
      this.signallingService.joinSession(this.sessionRequestId);
      this.cdr.detectChanges();
    });

    this.listenSignallingServiceEvents();
    this.listenWebRtcServiceEvents();

    this.detectOrietation();

    this.showMe();
  }

  private detectOrietation() {
    this.orientation =
      window.innerWidth > window.innerHeight ? 'horizontal' : 'vertical';
  }

  private listenSignallingServiceEvents() {
    this.subOnSessionDetailUpdated = this.signallingService.OnSessionDetailUpdated.subscribe(
      (sessionDetail: SessionDetail) => this.handleSessionDetailUpdated(sessionDetail)
    );
    this.subOnUserJoinSession = this.signallingService.OnUserJoinSession.subscribe(
      (joinedUserId: string) => this.handleUserJoinSession(joinedUserId)
    );
    this.subOnUserLeaveSession = this.signallingService.OnUserLeaveSesson.subscribe(
      (leftUserId: string) => this.handleUserLeaveSession(leftUserId)
    );
    this.subOnOfferVideoCall = this.signallingService.OnOfferVideoCall.subscribe(
      (result: { sessionId: string; sessionDetail: SessionDetail; }) => this.handleOfferVideoCall(result)
    );
    this.subOnAnswerVideoCall = this.signallingService.OnAnswerVideoCall.subscribe(
      (result: { sessionId: string; sessionDetail: SessionDetail; }) => this.handleAnswerVideoCall(result)
    );
    this.subOnReceiveIceCandidate = this.signallingService.OnReceiveIceCandidate.subscribe(
      (iceCandidate: RTCIceCandidate) => this.handleReceiveIceCandidate(iceCandidate)
    );
  }

  private listenWebRtcServiceEvents() {
    this.webRtcService.init();
    this.subOnConnectionStateChangedSubject = this.webRtcService.OnConnectionStateChangedSubject.subscribe(
      (state: RTCPeerConnectionState) => {
        this.connectionState = state;
        this.cdr.detectChanges();
      });
    this.webRtcService.OnRemoteStreamAddedSubject.subscribe(stream => {
      console.log('OnRemoteStreamAddedSubject:', stream);
      this.videoComponent.setRemoteStream(stream);
    });
    this.webRtcService.OnIceCandidateEventSubject.subscribe(candidate => {
      console.log('OnIceCandidateEventSubject:', candidate);
      if (this.sessionDetail.sessionId) {
        this.signallingService.SendIceCandidate(this.sessionDetail.sessionId, candidate);
      }
    });
  }

  getConnectionState(): RTCPeerConnectionState {
    return this.webRtcService.getConnectionState();
  }

  showMe() {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        this.webRtcService.addStream(stream);
        // for the local only video is important!
        this.videoComponent.setLocalStream(new MediaStream(stream.getVideoTracks()));
        // TODO: debug
        // this.videoComponent.setRemoteStream(new MediaStream(stream.getVideoTracks()));
      });
  }

  stopVideo() {
    this.videoComponent.stop();
  }

  stopWebRtc() {
    this.webRtcService.close();
  }

  private handleUserJoinSession(joinedUserId: string): void {
    console.log('joinedUserId:', joinedUserId);
    if (this.userId === joinedUserId) {

    } else {
      // other user joined this session
      // start video call
      this.startCall();
    }
  }

  private handleUserLeaveSession(leftUserId: string): void {
    console.log('leftUserId:', leftUserId);
    if (this.userId === leftUserId) {
      // TODO: more logic
    } else {
      // other user left this session
      this.stopWebRtc();
      this.stopVideo();
    }
  }

  ngOnDestroy() {
    this.webRtcService.ngOnDestroy();
    this.endCall();
    this.subOnSessionDetailUpdated?.unsubscribe();
    this.subOnUserJoinSession?.unsubscribe();
    this.subOnUserLeaveSession?.unsubscribe();
    this.subOnConnectionStateChangedSubject?.unsubscribe();
    this.subOnOfferVideoCall?.unsubscribe();
    this.subOnAnswerVideoCall?.unsubscribe();
    this.subOnReceiveIceCandidate?.unsubscribe();
  }

  async startCall() {
    if (this.sessionDetail?.offer) {
      console.log('Video call is already in progress!')
      return;
    }

    const user = this.store.getUser();
    if (this.sessionRequestId && user) {
      const offer = await this.webRtcService.createOffer();
      this.signallingService.offerVideoCall(this.sessionRequestId, offer);
    }
  }

  endCall() {
    const user = this.store.getUser();
    if (this.sessionDetail && user) {
      this.signallingService.leaveSession(this.sessionDetail.sessionId);
      this.stopVideo();
      this.stopWebRtc();
    }
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
    this.webRtcService.setRemoteDescription(result.sessionDetail.offer.content);
    const answer = await this.webRtcService.createAnswer();

    this.signallingService.answerVideoCall(this.sessionRequestId, answer);

  }
  // came from a user who started video
  // so this user has to create answer
  async handleAnswerVideoCall(result: {
    sessionId: string;
    sessionDetail: SessionDetail;
  }) {
    this.sessionDetail = result.sessionDetail;
    if (result.sessionDetail.answer) {
      this.webRtcService.setRemoteDescription(result.sessionDetail.answer.content);
    }
  }

  private async handleReceiveIceCandidate(iceCandidate: RTCIceCandidate) {
    try {
      await this.webRtcService.addIceCandidate(iceCandidate)
    } catch (e) {
      console.error('Error adding received ice candidate', e);
    }
  }

  handleSessionDetailUpdated(sessionDetail: SessionDetail) {
    this.sessionDetail = sessionDetail;
  }

  leave() {
    this.router.navigate(['/']);
  }

  mute() {
  }

  fullScreen() {
  }

  timeDone() {
    console.log('timeDone!');
  }

  /**
   * Listen windows resize event. If small screen than show CalendarView.Day
   * if bigger screen show CalendarView.Week
   * @param event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.detectOrietation();
  }

}
