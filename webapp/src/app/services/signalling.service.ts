import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { SignallingReceiveEvents, SignallingSendEvents } from './models';

@Injectable({
  providedIn: 'root',
})
export class SingnallingService {
  private signallingUrl = environment.signallingUrl;
  private hubName = 'mainHub';
  private connection: signalR.HubConnection;

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

  sendMessage(text: string) {
    if (!this.connection) {
      console.log('Connection is not established!');
    }
    this.connection.invoke(SignallingSendEvents.SendMessage, text);
  }

  private subscribeToEvents() {
    this.connection.on(SignallingReceiveEvents.ReceiveMessage, (data) => {
      console.log('received:', data);
    });
  }
}
