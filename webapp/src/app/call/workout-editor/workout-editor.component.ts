import { Component, Input, OnInit } from '@angular/core';
import { UserCallMetadata, Workout } from 'src/app/models';

@Component({
  selector: 'app-workout-editor',
  templateUrl: './workout-editor.component.html',
  styleUrls: ['./workout-editor.component.scss']
})
export class WorkoutEditorComponent {

  @Input() set userCallMetadata(metadata: UserCallMetadata) {
    this.workout = metadata.workout;
    this.position = metadata.uiLayout.position;
  }

  workout: Workout;
  position: 'left' | 'right';

  constructor() { }

  getPositionStyle() {
    if (this.position === 'left') {
      return { left: '5px' };
    }
    return { right: '5px' };
  }

}
