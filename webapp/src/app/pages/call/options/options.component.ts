import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User, UserCallMetadata } from 'src/app/models';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent {

  @Input() user: User;
  // TODO: pass only what it need, for detection change performance improvement
  @Input() userCallMetadata: UserCallMetadata;
  @Input() connectionState: RTCPeerConnectionState;

  @Output() startCall = new EventEmitter();
  @Output() endCall = new EventEmitter();
  @Output() toggleMute = new EventEmitter();
  @Output() toggleFit = new EventEmitter();
  @Output() leave = new EventEmitter();
  @Output() toggleFullscreen = new EventEmitter();

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
    this.toggleMute.emit();
  }

  onToggleFit() {
    this.toggleFit.emit();
  }

  onLeave() {
    this.leave.emit();
  }
  onToggleFullscreen(){
    this.toggleFullscreen.emit();
  }

  getPositionStyle() {
    if (this.userCallMetadata.uiLayout.position === 'left') {
      return { left: '0px' };
    }
    return { right: '0px' };
  }
}
