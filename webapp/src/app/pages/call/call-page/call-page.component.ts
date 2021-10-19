import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { from, Subscription } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import {
  SessionDetail, SessionRequest, SessionRequestType, UserCallMetadata,
  CallStateEnum, WorkoutState, User, WorkoutStateEnum, Workout
} from '../../../models';
import { AuthService, SessionRequestDataService, TimerService } from '../../../services';
import { SingnallingService } from '../../../services/signalling.service';
import { WebrtcService } from '../../../services/webrtc.service';
import { CallPageService } from './call-page.service';
import { VideoComponent } from './../video/video.component';
import { TimerComponent } from '../timer/timer.component';

const SERVICES = [WebrtcService, CallPageService];

@Component({
  selector: 'app-call-page',
  templateUrl: './call-page.component.html',
  styleUrls: ['./call-page.component.scss'],
  providers: [...SERVICES],
})
export class CallPageComponent implements OnInit, OnDestroy {
  @ViewChild('myVideo') myVideoComponent: VideoComponent;
  @ViewChild('remoteVideo') remoteVideoComponent: VideoComponent;
  @ViewChild('appTimer') appTimer: TimerComponent;

  CallStateEnum = CallStateEnum;
  localStream: MediaStream | undefined;
  orientation: 'horizontal' | 'vertical' = 'horizontal';
  connectedToSessionRoom = false;
  sessionRequestId = '';
  sessionRequest: SessionRequest;
  sessionDetail: SessionDetail;
  connectionState: RTCPeerConnectionState;

  userSetting: UserCallMetadata;
  remoteUserSetting: UserCallMetadata;

  userId: string = '';
  sessionTimerInSeconds: number = 900;// 15min
  // sessionTimerInSeconds: number = 10;

  private subOnWorkoutStateUpdated: Subscription | undefined;
  private subOnSessionDetailUpdated: Subscription | undefined;
  private subOnUserJoinSession: Subscription | undefined;
  private subOnUserLeaveSession: Subscription | undefined;
  private subOnConnectionStateChangedSubject: Subscription | undefined;
  private subOnRemoteStreamAddedSubject: Subscription | undefined;
  private subOnIceCandidateEventSubject: Subscription | undefined;

  private subOnOfferVideoCall: Subscription | undefined;
  private subOnAnswerVideoCall: Subscription | undefined;
  private subOnReceiveIceCandidate: Subscription | undefined;

  constructor(
    private sessionRequestDataService: SessionRequestDataService,
    private signallingService: SingnallingService,
    private webRtcService: WebrtcService,
    private authService: AuthService,
    private callPageService: CallPageService,
    private timerService: TimerService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.sessionRequestId = this.route.snapshot.params['sessionRequestId'];

    this.userSetting = this.callPageService.createDefaltUserSetting('', '');
    this.remoteUserSetting = this.callPageService.createDefaltRemoteUserSetting();

    this.authService.currentUser.subscribe(user => {
      this.userId = user && user.uid ? user.uid : '';
      if (this.userId) {

        this.userSetting.userInfo.userId = this.userId;
        this.userSetting.userInfo.userName = user?.displayName ?? '';
        this.updateOtherUserInfo();

        this.sessionRequestDataService.get(this.sessionRequestId)
          .pipe(
            tap(sessionRequest => this.sessionRequest = sessionRequest),
            mergeMap(s => from(this.showMe()))
          ).subscribe(() => {
            this.subscribeSignallingServiceEvents();
            this.signallingService.joinSession(this.sessionRequestId);
          });
      } else {
        this.unsubscribeSignallingServiceEvents();
      }
      this.cdr.detectChanges();
    });

    this.detectOrietation();
  }

  private updateOtherUserInfo() {
    this.sessionRequestDataService.getOtherUser(this.sessionRequestId).subscribe((otherUser: User) => {
      this.remoteUserSetting.userInfo.userId = otherUser.uid;
      this.remoteUserSetting.userInfo.userName = otherUser?.displayName ?? '';
      this.cdr.detectChanges();
    });
  }

  private subscribeSignallingServiceEvents() {
    this.subOnWorkoutStateUpdated = this.signallingService.OnWorkoutStateUpdated.subscribe(
      (args: { userId: string, workoutState: WorkoutState }) => this.handleWorkoutStateUpdated(args.userId, args.workoutState)
    );
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
    this.subOnReceiveIceCandidate = this.signallingService.OnSessionRequestUpdated.subscribe(
      (sessionRequest: SessionRequest) => this.handleSessionRequestUpdated(sessionRequest)
    );
  }

  private unsubscribeSignallingServiceEvents() {
    this.subOnWorkoutStateUpdated?.unsubscribe();
    this.subOnSessionDetailUpdated?.unsubscribe();
    this.subOnUserJoinSession?.unsubscribe();
    this.subOnUserLeaveSession?.unsubscribe();
    this.subOnOfferVideoCall?.unsubscribe();
    this.subOnAnswerVideoCall?.unsubscribe();
    this.subOnReceiveIceCandidate?.unsubscribe();
  }

  private subscribeWebRtcServiceEvents() {
    this.subOnConnectionStateChangedSubject = this.webRtcService.OnConnectionStateChangedSubject.subscribe(
      (state: RTCPeerConnectionState) => {
        this.connectionState = state;
        this.cdr.detectChanges();
      });
    this.subOnRemoteStreamAddedSubject = this.webRtcService.OnRemoteStreamAddedSubject.subscribe(stream => {
      this.remoteVideoComponent.setStream(stream);
      if (this.sessionDetail && this.sessionDetail.state === CallStateEnum.waiting) {
        this.sessionDetail.state = CallStateEnum.joined;
        this.appTimer.startTimer();
        this.signallingService.UpdateSessionDetail(this.sessionDetail);
      }
    });
    this.subOnIceCandidateEventSubject = this.webRtcService.OnIceCandidateEventSubject.subscribe(candidate => {
      if (this.sessionDetail?.sessionId && candidate) {
        this.signallingService.SendIceCandidate(this.sessionDetail.sessionId, candidate);
      }
    });
  }

  private unsubscribeListenWebRtcServiceEvents() {
    this.subOnConnectionStateChangedSubject?.unsubscribe();
    this.subOnRemoteStreamAddedSubject?.unsubscribe();
    this.subOnIceCandidateEventSubject?.unsubscribe();
  }

  showMe() {
    return navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        this.localStream = stream;
        // for the local, only video is important!
        this.myVideoComponent.setStream(new MediaStream(stream.getVideoTracks()));
        // TODO: debug
        // this.remoteVideoComponent.setStream(new MediaStream(stream.getVideoTracks()));
      });
  }

  // null means users haven't matched yet.
  getSessionState(): CallStateEnum | null {
    if (this.sessionDetail) {
      return this.sessionDetail.state;
    }
    return null;
  }

  private startWebRtc() {
    this.webRtcService.init();
    this.subscribeWebRtcServiceEvents();
  }

  private stopWebRtc() {
    this.unsubscribeListenWebRtcServiceEvents();
    this.webRtcService.close();
  }

  private handleUserJoinSession(joinedUserId: string): void {
    console.log('joinedUserId:', joinedUserId);
    if (this.userId !== joinedUserId) {
      this.updateOtherUserInfo();
      // other user joined this session
      // start video call
      this.startCall();
    }
  }

  private handleUserLeaveSession(leftUserId: string): void {
    console.log('leftUserId:', leftUserId);
    if (this.userId !== leftUserId) {
      // other user left this session
      this.stopWebRtc();
      this.remoteVideoComponent.stopStream();
    }
  }

  // this method is used for the Intant call situations.
  private handleSessionRequestUpdated(sessionRequest: SessionRequest): void {
    if (sessionRequest.id !== this.sessionRequestId) { return; }
    if (sessionRequest.sessionType !== SessionRequestType.Instant) { return; }
    if (this.sessionDetail) { return; }

    this.signallingService.joinSession(this.sessionRequestId);
  }

  ngOnDestroy() {
    this.endCall();
    this.unsubscribeSignallingServiceEvents();
    this.unsubscribeListenWebRtcServiceEvents();
  }

  endCall() {
    const user = this.authService.currentUser.getValue();
    if (!user) { return; }

    this.myVideoComponent.stopStream();
    this.remoteVideoComponent.stopStream();
    if (this.sessionDetail) {
      this.signallingService.leaveSession(this.sessionDetail.sessionId);
      this.stopWebRtc();
    } else {

    }
  }

  async startCall() {
    if (this.sessionDetail?.offer) {
      console.log('Video call is already in progress!')
      return;
    }

    const user = this.authService.currentUser.getValue();
    if (this.sessionRequestId && user) {
      this.startWebRtc();
      if (this.localStream) {
        this.webRtcService.addLocalStream(this.localStream);
      }
      const offer = await this.webRtcService.createOffer();
      await this.webRtcService.setLocalDescription(offer);
      this.signallingService.offerVideoCall(this.sessionRequestId, offer);
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

    this.updateOtherUserInfo();

    this.startWebRtc();

    this.sessionDetail = result.sessionDetail;
    await this.webRtcService.setRemoteDescription(result.sessionDetail.offer.content);
    if (this.localStream) {
      this.webRtcService.addLocalStream(this.localStream);
    }
    const answer = await this.webRtcService.createAnswer();
    await this.webRtcService.setLocalDescription(answer);

    this.signallingService.answerVideoCall(this.sessionRequestId, answer);
  }

  async handleAnswerVideoCall(result: {
    sessionId: string;
    sessionDetail: SessionDetail;
  }) {
    this.sessionDetail = result.sessionDetail;
    if (result.sessionDetail.answer) {
      await this.webRtcService.setRemoteDescription(result.sessionDetail.answer.content);
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

  handleWorkoutStateUpdated(userId: string, workoutState: WorkoutState) {
    console.log('handleWorkoutStateUpdated called!');
    // other user has updated workout state
    if (this.remoteUserSetting.userInfo.userId === userId) {
      this.remoteUserSetting.workoutState = workoutState;
    }
  }

  leave() {
    this.router.navigate(['/result', this.sessionRequestId]);
    // setTimeout(() => this.router.navigate(['/']), 1000);
  }

  toggleMute(setting: UserCallMetadata) {
    setting.uiLayout.optionValues.isMute = !setting.uiLayout.optionValues.isMute;
  }

  toggleFit(setting: UserCallMetadata) {
    setting.uiLayout.optionValues.isFit = !setting.uiLayout.optionValues.isFit;
  }

  toggleFullscreen() {
    var doc = window.document as any;
    var docEl = doc.documentElement as any;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
    }
    else {
      cancelFullScreen.call(doc);
    }
  }

  togglePause() {
    this.userSetting.workoutState.workout.current.isPaused = !this.userSetting.workoutState.workout.current.isPaused;
  }

  restartWorkout() {
    this.taskEditingDone();
  }

  updateWorkout(workout: Workout) {
    this.userSetting.workoutState.workout = workout;
  }

  // TODO: move to a service
  taskEditingDone() {
    this.timerService.stopTimer('workoutTimer');
    const state = this.userSetting.workoutState;
    state.state = WorkoutStateEnum.exercising;
    state.workout.current = { index: 0, second: 0, isPaused: false };
    // TODO: will be refactored to make immutable to pass to components
    this.userSetting = cloneDeep(this.userSetting);
    this.cdr.detectChanges();

    this.startWorkoutTimer();
    // this.signallingService.UpdateWorkoutState(this.sessionRequestId, workoutState);
  }

  private startWorkoutTimer() {
    this.timerService.setTimer('workoutTimer', 1000, true, () => {
      const workoutState = this.userSetting.workoutState;
      // skip if it is in pause state
      if (workoutState.workout.current.isPaused) { return; }
      const activeExercise = workoutState.workout.exercises[workoutState.workout.current.index];
      // increment timer if still in current exercise
      if (workoutState.workout.current.second < activeExercise.seconds) {
        workoutState.workout.current.second++;
      } else {
        if (workoutState.workout.exercises.length > workoutState.workout.current.index + 1) {
          // move to next exercise
          workoutState.workout.current.index++;
          workoutState.workout.current.second = 0;
        } else {
          // stop the exercises timer and finish workout
          workoutState.state = WorkoutStateEnum.done;
          workoutState.workout.current.index = -1;
          workoutState.workout.current.second = 0;
          this.timerService.stopTimer('workoutTimer');
        }
      }

      // TODO: will refactored to make immutable to pass to components
      this.userSetting = cloneDeep(this.userSetting);
      this.cdr.detectChanges();
    });;
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

  private detectOrietation() {
    this.orientation =
      window.innerWidth > window.innerHeight ? 'horizontal' : 'vertical';
  }

}
