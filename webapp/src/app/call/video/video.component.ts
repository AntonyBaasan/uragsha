import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  @ViewChild('me') me: ElementRef;
  @ViewChild('remote') remote: ElementRef;

  @Input()
  public set localStream(stream: MediaStream | null) {
    this.setStream(this.me, stream);
  }

  @Input()
  public set remoteStream(stream: MediaStream | null) {
    this.setStream(this.remote, stream);
  }

  constructor() { }

  ngOnInit(): void {
    console.log('');
  }

  private setStream(element: ElementRef, stream: MediaStream | null) {
    if (!element) { return; }
    element.nativeElement.srcObject = stream;
  }

}
