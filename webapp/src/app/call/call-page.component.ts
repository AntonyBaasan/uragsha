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

  private subOnSessionDetailUpdated: Subscription | undefined;
  private subOnUserJoinSession: Subscription | undefined;
  private subOnUserLeaveSession: Subscription | undefined;
  private subOnConnectionStateChangedSubject: Subscription | undefined;

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
  }

  private listenWebRtcServiceEvents() {
    this.subOnConnectionStateChangedSubject = this.webRtcService.OnConnectionStateChangedSubject.subscribe(
      (state: RTCPeerConnectionState) => {
        this.connectionState = state;
        this.cdr.detectChanges();
      });
  }

  getConnectionState(): RTCPeerConnectionState {
    return this.webRtcService.getConnectionState();
  }

  showMe() {
    this.videoComponent.showMe();
  }

  stop() {
    this.videoComponent.stop();
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
      // TODO: more logic
      this.stop();
    } else {
      // other user left this session
      this.stop();
    }
  }

  ngOnDestroy() {
    this.subOnSessionDetailUpdated?.unsubscribe();
    this.subOnUserJoinSession?.unsubscribe();
    this.subOnUserLeaveSession?.unsubscribe();
    this.subOnConnectionStateChangedSubject?.unsubscribe();
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
    }
  }

  handleSessionDetailUpdated(sessionDetail: SessionDetail) {
    this.sessionDetail = sessionDetail;
  }

  leave() {
    this.router.navigate(['/']);
  }

}
