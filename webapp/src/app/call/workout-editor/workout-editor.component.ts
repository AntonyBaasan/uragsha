import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { Exercise, UserCallMetadata, Workout, WorkoutState, WorkoutStateEnum } from 'src/app/models';
import { UtilityService } from 'src/app/services';

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

  @Output() updateWorkout = new EventEmitter<Workout>();
  @Output() ready = new EventEmitter();

  WorkoutStateEnum = WorkoutStateEnum;
  state: WorkoutState;
  workout: Workout;
  position: 'left' | 'right';
  inputExercise: string = '';

  constructor(private utilityService: UtilityService) { }

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

  getExerciseTime(exercise: Exercise): string {
    return this.utilityService.convertSecondsToMin(exercise.seconds);
  }

  onReady() {
    this.ready.emit();
  }

  insert() {
    if (this.inputExercise) {
      this.workout.exercises.push({ title: this.inputExercise, seconds: 60 });
      this.updateWorkout.emit(cloneDeep(this.workout));
    }
  }

  delete(index: number) {
    this.workout.exercises.splice(index, 1);
    this.updateWorkout.emit(cloneDeep(this.workout));
  }

}
