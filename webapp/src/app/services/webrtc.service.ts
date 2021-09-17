import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class WebrtcService implements OnDestroy {

  public OnRemoteStreamAddedSubject = new Subject<MediaStream>();
  public OnIceCandidateEventSubject = new Subject<RTCIceCandidate>();
  public OnConnectionStateChangedSubject = new Subject<RTCPeerConnectionState>();

  private webRtcConfiguration = {
    iceServers: environment.iceServers,
  };

  private peerConnection: RTCPeerConnection;

  init() {
    this.peerConnection = new RTCPeerConnection(this.webRtcConfiguration);
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.OnIceCandidateEventSubject.next(event.candidate);
      }
    };
    this.peerConnection.ontrack = (event) => {
      this.OnRemoteStreamAddedSubject.next(event?.streams[0])
    };
    this.peerConnection.onconnectionstatechange = (event) => {
      if (this.peerConnection) {
        this.OnConnectionStateChangedSubject.next(this.peerConnection.connectionState);
      }
    };
  }

  ngOnDestroy(): void {
    this.close();
  }

  close() {
    if (this.peerConnection) {
      this.peerConnection.close();
      (this.peerConnection as any) = null;
    }
  }

  isInitialized(): boolean {
    return this.peerConnection != null;
  }

  async addIceCandidate(iceCandidate: RTCIceCandidate) {
    return await this.peerConnection.addIceCandidate(iceCandidate);
  }

  async createOffer(): Promise<RTCSessionDescriptionInit> {
    const offer = await this.peerConnection.createOffer();
    return offer;
  }

  async createAnswer(): Promise<RTCSessionDescriptionInit> {
    const answer = await this.peerConnection.createAnswer();
    return answer
  }

  async setLocalDescription(desc: RTCSessionDescriptionInit) {
    await this.peerConnection.setLocalDescription(desc);
  }

  async setRemoteDescription(answer: RTCSessionDescriptionInit) {
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  addLocalStream(stream: MediaStream) {
    // in this case tracks var passes as placeholder, on the other side we only use stream
    var tracks = stream.getTracks();
    for (const track of tracks) {
      this.peerConnection.addTrack(track, stream);
    }
  }

  getConnectionState(): RTCPeerConnectionState {
    return this.peerConnection?.connectionState;
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
