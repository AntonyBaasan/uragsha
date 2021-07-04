import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";  // or from "@microsoft/signalr" if you are using a new library
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private webApiServer = environment.webApiUrl;
  private signallingServer = environment.messagingUrl;
  private mainHub = '/mainHub';

  public messageSubject = new Subject<string>();
  private hubConnection: signalR.HubConnection;

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.signallingServer + this.mainHub)
      .build();
    return this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
        this.startMessageListener();
      })
      .catch(err => console.log('Error while starting connection: ' + err))
  }

  private startMessageListener = () => {
    this.hubConnection.on('ReceiveMessage', (message: string) => {
      console.log(message);
      if (this.messageSubject) { this.messageSubject.next(message) }
    });
  }

  public sendMessage(message: string) {
    this.hubConnection.invoke('SendMessage', message);
  }
}
