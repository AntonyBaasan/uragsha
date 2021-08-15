import { Injectable, OnDestroy } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { parseISO } from 'date-fns';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  SessionDetail,
  SessionRequest,
  SignallingReceiveEvents,
  SignallingSendEvents,
} from '../models';

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
  public OnStartOrJoinSession = new Subject<{
    sessionId: string;
    status: 'created' | 'joined';
    sessionDetail: SessionDetail;
  }>();
  public OnSessionDetailUpdated = new Subject<SessionDetail>();

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.signallingUrl + '/' + this.hubName)
      .withAutomaticReconnect()
      .build();

    this.subscribeToEvents();
    this.connection
      .start()
      .then(() => {
        console.log('SignalR connection started');
      })
      .catch((err) => {
        return console.error(err.toString());
      });
    console.log('SingnallingService created!');
  }

  ngOnDestroy(): void {
    this.connection
      .stop()
      .then(() => console.log('SignalR connection started'));
  }

  sendMessage(text: string) {
    if (!this.isConnected()) {
      console.log('Connection is not established!');
      return;
    }
    this.connection.invoke(SignallingSendEvents.SendMessage, text);
  }

  joinToRoom(room: string) {
    if (!this.isConnected()) {
      console.log('Connection is not established!');
      return;
    }
    this.connection.invoke(SignallingSendEvents.JoinToRoom, room);
  }

  removeFromRoom(room: string) {
    if (!this.isConnected()) {
      console.log('Connection is not established!');
      return;
    }
    this.connection.invoke(SignallingSendEvents.RemoveFromRoom, room);
  }

  setUserName(userId: string): Promise<void> {
    if (!this.isConnected()) {
      console.log('Connection is not established!');
      return Promise.resolve();
    }
    return this.connection.invoke(SignallingSendEvents.SetMyName, userId);
  }

  getUserSessionRequests(userId: string): Promise<void> {
    if (!this.isConnected()) {
      console.log('Connection is not established!');
      return Promise.resolve();
    }
    return this.connection.invoke(
      SignallingSendEvents.GetUserSessionRequests,
      userId
    );
  }

  createSessionRequest(sessionRequest: SessionRequest): Promise<void> {
    if (!this.isConnected()) {
      console.log('Connection is not established!');
      return Promise.resolve();
    }
    return this.connection.invoke(
      SignallingSendEvents.CreateSessionRequest,
      sessionRequest
    );
  }

  deleteSessionRequest(sessionRequestId: string): Promise<void> {
    if (!this.isConnected()) {
      console.log('Connection is not established!');
      return Promise.resolve();
    }
    return this.connection.invoke(
      SignallingSendEvents.DeleteSessionRequest,
      sessionRequestId
    );
  }

  startOrJoinSession(userId: string, sessionRequestId: string): Promise<void> {
    if (!this.isConnected()) {
      console.log('Connection is not established!');
      return Promise.resolve();
    }
    return this.connection.invoke(
      SignallingSendEvents.StartOrJoinSession,
      userId,
      sessionRequestId
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
      SignallingReceiveEvents.OnWebRtcCallRequest,
      (request: any) => {
        this.onWebRtcRequest.next(request);
      }
    );
    this.connection.on(
      SignallingReceiveEvents.OnGetUserSessionRequests,
      (sessionRequests: SessionRequest[]) => {
        this.OnGetUserSessionRequests.next(
          sessionRequests.map((s) => this.mapStringToDate(s))
        );
      }
    );
    this.connection.on(
      SignallingReceiveEvents.OnSessionRequestUpdated,
      (sessionRequest: SessionRequest) => {
        this.OnSessionRequestUpdated.next(this.mapStringToDate(sessionRequest));
      }
    );
    this.connection.on(
      SignallingReceiveEvents.OnSessionRequestCreated,
      (sessionRequest: SessionRequest) => {
        this.OnSessionRequestCreated.next(this.mapStringToDate(sessionRequest));
      }
    );
    this.connection.on(
      SignallingReceiveEvents.OnSessionRequestDeleted,
      (sessionRequestId: string) => {
        this.OnSessionRequestDeleted.next(sessionRequestId);
      }
    );

    this.connection.on(
      SignallingReceiveEvents.OnStartOrJoinSession,
      (result: {
        sessionId: string;
        status: 'created' | 'joined';
        sessionDetail: SessionDetail;
      }) => {
        this.OnStartOrJoinSession.next(result);
      }
    );
    this.connection.on(
      SignallingReceiveEvents.OnSessionDetailUpdated,
      (sessionDetail: SessionDetail) => {
        this.OnSessionDetailUpdated.next(sessionDetail);
      }
    );
  }

  private mapStringToDate(sessionRequest: SessionRequest): SessionRequest {
    return Object.assign(sessionRequest, {
      start: parseISO(sessionRequest.start as any),
      end: parseISO(sessionRequest.end as any),
    });
  }
}
