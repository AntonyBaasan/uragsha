import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent {

  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  @Input() isFit: boolean;
  @Input() orientation: 'horizontal' | 'vertical';

  stream: MediaStream | null;

  constructor(private cdr: ChangeDetectorRef) { }

  stopStream() {
    this.stream?.getTracks().forEach((track) => {
      if (track.readyState == 'live') {
        track.stop();
      }
    });
    this.setStream(null);
    this.cdr.detectChanges();
  }

  setStream(stream: MediaStream | null) {
    if (!this.videoPlayer) { return; }

    this.stream = stream;
    this.videoPlayer.nativeElement.srcObject = stream;
  }

  getFitClass() {
    if (this.isFit) {
      return this.orientation === 'horizontal' ? 'h-100' : 'w-100';
    } else {
      return this.orientation === 'horizontal' ? 'w-100' : 'h-100';
    }
  }

}
