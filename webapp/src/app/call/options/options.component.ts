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

  @Output() startCall = new EventEmitter();
  @Output() endCall = new EventEmitter();
  @Output() mute = new EventEmitter();
  @Output() fullScreen = new EventEmitter();
  @Output() leave = new EventEmitter();

  constructor() { }

  onStartCall() {
    this.startCall.emit();
  }

  onEndCall() {
    this.endCall.emit();
  }

  toggleOptions() {

  }

  onMute() {
    this.mute.emit();
  }

  onFullScreen() {
    this.fullScreen.emit();
  }

  onLeave() {
    this.leave.emit();
  }
}
