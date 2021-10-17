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

  constructor(private cdr: ChangeDetectorRef) { }

  stopStream() {
    const stream = this.videoPlayer.nativeElement.srcObject;
    stream?.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    this.videoPlayer.nativeElement.srcObject = null;
    this.cdr.detectChanges();
  }

  setStream(stream: MediaStream | null) {
    if (!this.videoPlayer) { return; }

    if (stream) {
      this.videoPlayer.nativeElement.srcObject = stream;
    }
  }

  getFitClass() {
    if (this.isFit) {
      return this.orientation === 'horizontal' ? 'h-100' : 'w-100';
    } else {
      return this.orientation === 'horizontal' ? 'w-100' : 'h-100';
    }
  }

}
