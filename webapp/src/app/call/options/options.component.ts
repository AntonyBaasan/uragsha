import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User, UserCallMetadata } from 'src/app/models';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent {

  @Input() user: User;
  @Input() userCallState: UserCallMetadata;
  @Input() connectionState: RTCPeerConnectionState;

  @Output() startCall = new EventEmitter();
  @Output() endCall = new EventEmitter();
  @Output() mute = new EventEmitter();
  @Output() toggleFit = new EventEmitter();
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

  onToggleFit() {
    this.toggleFit.emit();
  }

  onLeave() {
    this.leave.emit();
  }
}
