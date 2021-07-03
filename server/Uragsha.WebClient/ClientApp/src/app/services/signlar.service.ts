import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";  // or from "@microsoft/signalr" if you are using a new library
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private server = 'https://localhost:5001';
  private hub = '/chart';

  public messageSubject: Subject<string>;
  private hubConnection: signalR.HubConnection

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.server + this.hub)
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  public startMessageListener = () => {
    this.hubConnection.on('onMessageReceived', (message: string) => {
      console.log(message);
      if (this.messageSubject) { this.messageSubject.next(message) }
    });
  }
}
