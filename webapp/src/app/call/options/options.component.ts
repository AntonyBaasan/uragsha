import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/models';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent {

  @Input() user: User;
  @Input() connectionState: RTCPeerConnectionState;

  @Output() onLeave = new EventEmitter();
  @Output() onStartCall = new EventEmitter();
  @Output() onMute = new EventEmitter();
  @Output() onFullScreen = new EventEmitter();

  constructor() { }

  showMe() {
    // this.videoComponent.showMe();
  }

  stop() {
    // this.videoComponent.stop();
  }

  async startCall() {
    // if (this.sessionDetail?.offer) {
    //   console.log('Video call is already in progress!')
    //   return;
    // }
    // const user = this.store.getUser();
    // if (this.sessionRequestId && user) {
    //   const offer = await this.webRtcService.createOffer();
    //   this.signallingService.offerVideoCall(this.sessionRequestId, offer);
    // }
  }

  endCall() {
    // const user = this.store.getUser();
    // if (this.sessionDetail && user) {
    //   this.signallingService.leaveSession(this.sessionDetail.sessionId);
    // }
  }

  toggleOptions() {

  }

  mute() {
    this.onMute.emit();
  }

  fullScreen() {
    this.onFullScreen.emit();
  }

  leave() {
    this.onLeave.emit();
  }
}
