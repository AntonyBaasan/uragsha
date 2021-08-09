import { OnInit } from '@angular/core';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SingnallingService } from './signalling.service';

@Injectable()
export class WebrtcService implements OnDestroy {
  senderId: string;
  peerConnection: RTCPeerConnection | undefined;

  constructor(private signallinService: SingnallingService) {
    this.senderId = this.guid();
    this.setupWebRtc();
  }

  ngOnDestroy(): void {
    if (this.peerConnection) {
      this.peerConnection.close();
    }
  }

  private setupWebRtc() {
    this.signallinService.onWebRtcRequest.subscribe((request) =>
      this.handleWebRtcRequest(request)
    );

    try {
      this.peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.services.mozilla.com' },
          { urls: 'stun:stun.l.google.com:19302' },
        ],
      });
    } catch (error) {
      console.log(error);
      this.peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.services.mozilla.com' },
          { urls: 'stun:stun.l.google.com:19302' },
        ],
      });
    }
  }

  handleWebRtcRequest(request: any): void {}

  guid() {
    return (
      this.s4() +
      this.s4() +
      '-' +
      this.s4() +
      '-' +
      this.s4() +
      '-' +
      this.s4() +
      '-' +
      this.s4() +
      this.s4() +
      this.s4()
    );
  }
  s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
}
