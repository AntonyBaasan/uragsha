import {defaultStatView} from '../constants/DefaultValues';
import {ExcerciseTaskStatus, ExerciseTask} from '../models/ExerciseTask';
import {DailyStat, Stat, StatView} from '../models/Stat';

export function calculateStatView(statsByDays: {
  [day: string]: DailyStat;
}): StatView {
  const statView: StatView = Object.assign({}, defaultStatView);
  if (statsByDays) {
    for (const [day, statsByWorkout] of Object.entries(statsByDays)) {
      for (const [workoutId, stats] of Object.entries(statsByWorkout)) {
        stats.forEach(s => {
          statView.workout += 1;
          statView.exercise += s.done;
        });
      }
    }
  }
  return statView;
}

export function convertTaskListToStat(
  workoutId: string,
  taskList: ExerciseTask[],
): Stat {
  const countableTasks = taskList.filter(t => !t.isRest);
  const done = countableTasks.filter(
    task => task.status === ExcerciseTaskStatus.Done,
  ).length;
  const skipped = countableTasks.filter(
    task => task.status === ExcerciseTaskStatus.Skipped,
  ).length;
  const r = {
    day: getFormattedDate(new Date()),
    workoutId,
    done,
    skipped,
  };
  console.log('getStat:', r);
  return r;
}

export function getFormattedDate(date: Date) {
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [year, month, day].join('');
}
