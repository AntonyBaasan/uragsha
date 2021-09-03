import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SessionDetail } from 'src/app/models';
import { SingnallingService, WebrtcService } from 'src/app/services';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, OnDestroy {

  @ViewChild('me') me: ElementRef;
  @ViewChild('remote') remote: ElementRef;

  @Input() sessionRequestId: string;
  @Input() sessionDetail: SessionDetail;

  private subOnOfferVideoCall: Subscription | undefined;
  private subOnAnswerVideoCall: Subscription | undefined;
  private subOnSessionDetailUpdated: Subscription | undefined;
  private subOnReceiveIceCandidate: Subscription | undefined;

  constructor(
    private signallingService: SingnallingService,
    private webRtcService: WebrtcService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.listenSignallingServiceEvents();
    this.listenWebRtcServiceEvents();
  };

  ngOnDestroy() {
    this.subOnOfferVideoCall?.unsubscribe();
    this.subOnAnswerVideoCall?.unsubscribe();
    this.subOnSessionDetailUpdated?.unsubscribe();
    this.subOnReceiveIceCandidate?.unsubscribe();
  }

  showMe() {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        this.webRtcService.addStream(stream);
        this.setLocalStream(stream);
      });
  }

  stop() {
    this.setLocalStream(null);
    this.setRemoteStream(null);
    this.webRtcService.ngOnDestroy();
    this.cdr.detectChanges();
  }

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
    this.subOnReceiveIceCandidate = this.signallingService.OnReceiveIceCandidate.subscribe(
      (iceCandidate: RTCIceCandidate) => this.handleReceiveIceCandidate(iceCandidate)
    );
  }

  private listenWebRtcServiceEvents() {
    this.webRtcService.init();
    this.webRtcService.OnRemoteStreamAddedSubject.subscribe(stream => {
      this.setRemoteStream(stream);
    });
    this.webRtcService.OnIceCandidateEventSubject.subscribe(candidate => {
      if (this.sessionDetail) {
        this.signallingService.SendIceCandidate(this.sessionDetail.sessionId, candidate);
      }
    });
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

    this.signallingService.answerVideoCall(this.sessionRequestId, answer);

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

  private async handleReceiveIceCandidate(iceCandidate: RTCIceCandidate) {
    try {
      await this.webRtcService.addIceCandidate(iceCandidate)
    } catch (e) {
      console.error('Error adding received ice candidate', e);
    }
  }
  private setLocalStream(stream: MediaStream | null) {
    this.setStream(this.me, stream);
  }

  private setRemoteStream(stream: MediaStream | null) {
    this.setStream(this.remote, stream);
  }
  private setStream(element: ElementRef, stream: MediaStream | null) {
    if (!element) { return; }
    element.nativeElement.srcObject = stream;
  }

}
