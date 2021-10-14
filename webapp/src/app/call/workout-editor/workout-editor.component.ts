import { Component, Input, OnInit } from '@angular/core';
import { UserCallMetadata } from 'src/app/models';

@Component({
  selector: 'app-workout-editor',
  templateUrl: './workout-editor.component.html',
  styleUrls: ['./workout-editor.component.scss']
})
export class WorkoutEditorComponent implements OnInit {

  @Input() set userCallMetadata(metadata: UserCallMetadata) {
    this.workout = metadata.workout;
    this.position = metadata.uiLayout.position;
  }

  workout: string[];
  position: 'left' | 'right';

  constructor() { }

  ngOnInit(): void {
  }

  getPositionStyle() {
    if (this.position === 'left') {
      return { left: '5px' };
    }
    return { right: '5px' };
  }

}
