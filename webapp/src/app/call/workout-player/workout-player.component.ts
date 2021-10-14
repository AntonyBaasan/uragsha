import { Component, Input, OnInit } from '@angular/core';
import { addSeconds, format } from 'date-fns';
import { Exercise, UserCallMetadata, Workout } from 'src/app/models';

@Component({
  selector: 'app-workout-player',
  templateUrl: './workout-player.component.html',
  styleUrls: ['./workout-player.component.scss']
})
export class WorkoutPlayerComponent {

  @Input() set userCallMetadata(metadata: UserCallMetadata) {
    this.workout = metadata.workout;
    this.position = metadata.uiLayout.position;
  }

  workout: Workout;
  position: 'left' | 'right'

  constructor() { }

  getExerciseTime(exercise: Exercise): string {
    return this.formattedTime(exercise.seconds);
  }

  // TODO: move to shared service
  private formattedTime(seconds: number) {
    var helperDate = addSeconds(new Date(0), seconds);
    return format(helperDate, 'mm:ss');
  }

  getPositionStyle() {
    if (this.position === 'left') {
      return { left: '5px' };
    }
    return { right: '5px' };
  }
}
