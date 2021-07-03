import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../services/signlar.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  message: string;

  constructor(private signalRService: SignalRService) {}

  ngOnInit(): void {
    this.signalRService.startConnection()
  }

  sendMessage() {
    console.log(this.message);

  }
}
