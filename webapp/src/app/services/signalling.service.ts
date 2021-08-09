import { Injectable, OnDestroy, OnInit } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SignallingReceiveEvents, SignallingSendEvents } from './models';

@Injectable({
  providedIn: 'root',
})
export class SingnallingService implements OnDestroy {
  private signallingUrl = environment.signallingUrl;
  private hubName = 'mainHub';
  private connection: signalR.HubConnection;

  public onTextMessage = new Subject<string>();
  public onWebRtcRequest = new Subject<any>();

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
  }
}
