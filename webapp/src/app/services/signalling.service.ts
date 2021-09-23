import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SessionDetail, SessionRequest, SignallingReceiveEvents, SignallingSendEvents, User } from '../models';
import { ModelHelperService } from './model-helper.service';

@Injectable({
  providedIn: 'root',
})
export class SingnallingService implements OnDestroy {
  private signallingUrl = environment.signallingUrl;
  private hubName = 'mainHub';
  private connection: signalR.HubConnection;

  public onTextMessage = new Subject<string>();
  public onWebRtcRequest = new Subject<any>();
  public OnGetUserSessionRequests = new Subject<SessionRequest[]>();
  public OnSessionRequestUpdated = new Subject<SessionRequest>();
  public OnSessionRequestCreated = new Subject<SessionRequest>();
  public OnSessionRequestDeleted = new Subject<string>();
  public OnOfferVideoCall = new Subject<{
    sessionId: string;
    sessionDetail: SessionDetail;
  }>();
  public OnAnswerVideoCall = new Subject<{
    sessionId: string;
    sessionDetail: SessionDetail;
  }>();
  public OnSessionDetailUpdated = new Subject<SessionDetail>();
  public OnReceiveIceCandidate = new Subject<any>();
  public OnUserLeaveSesson = new Subject<string>();
  public OnUserJoinSession = new Subject<string>();

  constructor(private modelHelperService: ModelHelperService) { }

  ngOnDestroy(): void {
    this.connection?.stop()
      .then(() => console.log('SignalR connection started'));
  }

  connect(user: User) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.signallingUrl + '/' + this.hubName, { accessTokenFactory: () => user.token })
      .withAutomaticReconnect()
      .build();

    this.subscribeToEvents();
    console.log('SingnallingService created!');
    return this.connection
      .start()
      .then(() => {
        this.afterLogin(user);
        console.log('SignalR connection started');
      })
      .catch((err) => {
        return console.error(err.toString());
      });
  }

  disconnect() {
    if (this.connection) {
      return this.connection.stop();
    }
    return Promise.resolve();
  }

  sendMessage(text: string) {
    if (!this.isConnected()) {
      console.log('Connection is not established!');
      return;
    }
    this.connection.invoke(SignallingSendEvents.SendMessage, text);
  }

  // called always after connection
  private afterLogin(user: User): Promise<void> {
    if (!this.isConnected()) {
      console.log('Connection is not established!');
      return Promise.resolve();
    }
    return this.connection.invoke(SignallingSendEvents.AfterLogin, user);
  }


  offerVideoCall(sessionRequestId: string, offer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.isConnected()) {
      console.log('Connection is not established!');
      return Promise.resolve();
    }
    return this.connection.invoke(
      SignallingSendEvents.OfferVideoCall,
      sessionRequestId,
      offer
    );
  }

  answerVideoCall(sessionRequestId: string, answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.isConnected()) {
      console.log('Connection is not established!');
      return Promise.resolve();
    }
    return this.connection.invoke(
      SignallingSendEvents.AnswerVideoCall,
      sessionRequestId,
      answer
    );
  }

  joinSession(sessionRequestId: string) {
    if (!this.isConnected()) {
      console.log('Connection is not established!');
      return Promise.resolve();
    }
    return this.connection.invoke(
      SignallingSendEvents.JoinSession,
      sessionRequestId
    );
  }

  leaveSession(sessionId: string) {
    if (!this.isConnected()) {
      console.log('Connection is not established!');
      return Promise.resolve();
    }
    return this.connection.invoke(
      SignallingSendEvents.LeaveSession,
      sessionId
    );
  }

  UpdateSessionDetail(userId: string, sessionDetail: SessionDetail): Promise<void> {
    if (!this.isConnected()) {
      console.log('Connection is not established!');
      return Promise.resolve();
    }
    return this.connection.invoke(
      SignallingSendEvents.UpdateSessionDetail,
      userId,
      sessionDetail
    );
  }

  SendIceCandidate(sessionId: string, iceCandidate: RTCIceCandidate): Promise<void> {
    if (!this.isConnected()) {
      console.log('Connection is not established!');
      return Promise.resolve();
    }
    return this.connection.invoke(
      SignallingSendEvents.SendIceCandidate,
      sessionId,
      iceCandidate
    );
  }

  private isConnected(): boolean {
    return (
      this.connection &&
      this.connection.state === signalR.HubConnectionState.Connected
    );
  }

  private subscribeToEvents() {
    this.connection.on(
      SignallingReceiveEvents.OnTextMessage,
      (data: string) => {
        this.onTextMessage.next(data);
      }
    );
    this.connection.on(
      SignallingReceiveEvents.OnGetUserSessionRequests,
      (sessionRequests: SessionRequest[]) => {
        this.OnGetUserSessionRequests.next(
          sessionRequests.map((s) => this.modelHelperService.fixSessionRequestDateUtcToLocal(s))
        );
      }
    );
    this.connection.on(
      SignallingReceiveEvents.OnSessionRequestUpdated,
      (sessionRequest: SessionRequest) => {
        this.OnSessionRequestUpdated.next(this.modelHelperService.fixSessionRequestDateUtcToLocal(sessionRequest));
      }
    );
    this.connection.on(
      SignallingReceiveEvents.OnSessionRequestCreated,
      (sessionRequest: SessionRequest) => {
        this.OnSessionRequestCreated.next(this.modelHelperService.fixSessionRequestDateUtcToLocal(sessionRequest));
      }
    );
    this.connection.on(
      SignallingReceiveEvents.OnSessionRequestDeleted,
      (sessionRequestId: string) => {
        this.OnSessionRequestDeleted.next(sessionRequestId);
      }
    );

    this.connection.on(
      SignallingReceiveEvents.OnOfferVideoCall,
      (result: {
        sessionId: string;
        sessionDetail: SessionDetail;
      }) => {
        this.OnOfferVideoCall.next(result);
      }
    );
    this.connection.on(
      SignallingReceiveEvents.OnAnswerVideoCall,
      (result: {
        sessionId: string;
        sessionDetail: SessionDetail;
      }) => {
        this.OnAnswerVideoCall.next(result);
      }
    );
    this.connection.on(
      SignallingReceiveEvents.OnSessionDetailUpdated,
      (sessionDetail: SessionDetail) => {
        this.OnSessionDetailUpdated.next(sessionDetail);
      }
    );
    this.connection.on(
      SignallingReceiveEvents.OnReceiveIceCandidate,
      (iceCandidate: any) => {
        this.OnReceiveIceCandidate.next(iceCandidate);
      }
    );

    this.connection.on(
      SignallingReceiveEvents.OnUserJoinSession,
      (userId: any) => {
        this.OnUserJoinSession.next(userId);
      }
    );
    this.connection.on(
      SignallingReceiveEvents.OnUserLeaveSession,
      (userId: any) => {
        this.OnUserLeaveSesson.next(userId);
      }
    );
  }

}
