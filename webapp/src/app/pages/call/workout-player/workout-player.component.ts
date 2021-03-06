import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Exercise, UserCallMetadata, Workout, WorkoutState, WorkoutStateEnum } from 'src/app/models';
import { UtilityService } from 'src/app/services';

@Component({
  selector: 'app-workout-player',
  templateUrl: './workout-player.component.html',
  styleUrls: ['./workout-player.component.scss']
})
export class WorkoutPlayerComponent {

  @Input() set userCallMetadata(metadata: UserCallMetadata) {
    this.state = metadata.workoutState;
    this.workout = metadata.workoutState.workout;
    this.position = metadata.uiLayout.position;
  }

  @Output() togglePause = new EventEmitter();
  @Output() restart = new EventEmitter();

  WorkoutStateEnum = WorkoutStateEnum;
  state: WorkoutState;
  workout: Workout;
  position: 'left' | 'right'

  constructor(private utilityService: UtilityService) { }

  shouldShow(): boolean {
    return this.state.state === WorkoutStateEnum.exercising
      || this.state.state === WorkoutStateEnum.done;
  }

  isLocal() {
    return this.state.isLocal;
  }

  getExerciseTime(exercise: Exercise): string {
    return this.utilityService.convertSecondsToMin(exercise.seconds);
  }

  getPositionStyle() {
    if (this.position === 'left') {
      return { left: '0px' };
    }
    return { right: '0px' };
  }

  activeFillLeft(index: number) {
    if (!this.isActive(index)) { return null; }

    const activeExercise = this.workout.exercises[this.workout.current.index];

    // 60 second exercise, 20 seconds passed => should return 33%
    const passed = 100 * this.workout.current.second / activeExercise.seconds;
    const left = 100 - passed;
    return { width: `${left}%` };
  }

  isActive(index: number): boolean {
    return index === this.state.workout.current.index;
  }

  onTogglePause() {
    this.togglePause.emit();
  }

  onRestart() {
    this.restart.emit();
  }

  isPaused() {
    return this.workout.current.isPaused;
  }

  isPauseButtonsDisabled() {
    return this.state.state !== WorkoutStateEnum.exercising;
  }
}
