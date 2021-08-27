import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class WebrtcService implements OnDestroy {
  public remoteStreamAddedSubject = new Subject<MediaStream>();
  public iceCandidateEventSubject = new Subject<RTCIceCandidate>();

  private webRtcConfiguration = {
    iceServers: environment.iceServers,
  };

  private peerConnection: RTCPeerConnection;

  init() {
    this.peerConnection = new RTCPeerConnection(this.webRtcConfiguration);
    this.peerConnection.addEventListener('icecandidate', (event) => {
      if (event.candidate) {
        this.iceCandidateEventSubject.next(event.candidate);
      }
    });

    // remote stream was added, so start listen
    // this.peerConnection.addEventListener('track', (event) => {
    //   this.remoteStreamAddedSubject.next(event?.streams[0])
    // });
    this.peerConnection.ontrack = (event) => {
      this.remoteStreamAddedSubject.next(event?.streams[0])
    };
  }

  ngOnDestroy(): void {
    if (this.peerConnection) {
      this.peerConnection.close();
    }
  }

  async addIceCandidate(iceCandidate: RTCIceCandidate) {
    return await this.peerConnection.addIceCandidate(iceCandidate);
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }

  async createAnswer(): Promise<RTCSessionDescriptionInit> {
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    return answer
  }

  async setRemoteDescription(answer: RTCSessionDescriptionInit) {
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  addStream(stream: MediaStream) {
    // in this case tracks var passes as placeholder, on the other side we only use stream
    var tracks = stream.getTracks();
    for (const track of tracks) {
      this.peerConnection.addTrack(track, stream);
    }
  }

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
