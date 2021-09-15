import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent {

  @ViewChild('me') me: ElementRef;
  @ViewChild('remote') remote: ElementRef;
  @Input() orientation: 'horizontal' | 'vertical';


  constructor(private cdr: ChangeDetectorRef) { }

  stop() {
    this.setLocalStream(null);
    this.setRemoteStream(null);
    this.cdr.detectChanges();
  }

  setLocalStream(stream: MediaStream | null) {
    this.setStream(this.me, stream);
  }

  setRemoteStream(stream: MediaStream | null) {
    this.setStream(this.remote, stream);
  }
  private setStream(element: ElementRef, stream: MediaStream | null) {
    if (!element) { return; }
    element.nativeElement.srcObject = stream;
  }


}
