import { Component, Input, OnInit } from '@angular/core';
import { UserCallMetadata, Workout, WorkoutState, WorkoutStateEnum } from 'src/app/models';

@Component({
  selector: 'app-workout-editor',
  templateUrl: './workout-editor.component.html',
  styleUrls: ['./workout-editor.component.scss']
})
export class WorkoutEditorComponent {

  @Input() set userCallMetadata(metadata: UserCallMetadata) {
    this.state = metadata.workoutState;
    this.workout = metadata.workoutState.workout;
    this.position = metadata.uiLayout.position;
  }

  WorkoutStateEnum = WorkoutStateEnum;
  state: WorkoutState;
  workout: Workout;
  position: 'left' | 'right';

  constructor() { }

  shouldShow(): boolean {
    if (this.state.isLocal) {
      return this.state.state === WorkoutStateEnum.planning;
    }
    return false;
  }

  getPositionStyle() {
    if (this.position === 'left') {
      return { left: '5px' };
    }
    return { right: '5px' };
  }

}
