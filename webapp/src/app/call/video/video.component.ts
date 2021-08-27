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
  public set localStreams(tracks: MediaStreamTrack[]) {
    this.setStream(this.me, tracks);
  }

  @Input()
  public set remoteStreams(tracks: MediaStreamTrack[]) {
    this.setStream(this.remote, tracks);
  }

  constructor() { }

  ngOnInit(): void {
    console.log('');
  }

  private setStream(element: ElementRef, tracks: MediaStreamTrack[]) {
    if (!element) { return; }
    if (tracks && tracks.length > 0) {
      element.nativeElement.srcObject = new MediaStream(tracks);
    } else {
      element.nativeElement.srcObject = null;
    }
  }

}
