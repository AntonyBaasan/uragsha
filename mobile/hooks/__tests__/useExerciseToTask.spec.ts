// import 'react-native-get-random-values';
// import {ExerciseType} from '../../models/ExcerciseType';
// import {Exercise, ExerciseMetadataStatus} from '../../models/Exercise';

// import useMapExerciseToTask from '../useMapExerciseToTask';

// describe('useMapExerciseToTask', () => {
//   let exercises: Exercise[] = [];
//   beforeEach(() => {
//     exercises = [
//       {
//         id: 'aaa',
//         workoutId: '1',
//         exerciseType: ExerciseType.Cardio,
//         order: 0,
//         title: 'title1',
//         description: 'description1',
//         sets: 1,
//         hasRest: false,
//         duration: 60,
//         reps: 10,
//         metadata: {status: ExerciseMetadataStatus.None},
//       },
//     ];
//   });
//   it('should return empty array if empty exercises', () => {
//     const taskList = useMapExerciseToTask([]);
//     expect(taskList.length).toBe(0);
//   });
//   it('should return empty array if null exercises', () => {
//     const taskList = useMapExerciseToTask(undefined);
//     expect(taskList.length).toBe(0);
//   });
//   it('should convert Exercise object to ExerciseType', () => {
//     const taskList = useMapExerciseToTask(exercises);

//     expect(taskList.length).toBe(1);
//     expect(taskList[0].exerciseId).toBe('aaa');
//     expect(taskList[0].exerciseType).toBe(ExerciseType.Cardio);
//     expect(taskList[0].title).toBe('title1');
//     expect(taskList[0].description).toBe('description1');
//     expect(taskList[0].duration).toBe(60);
//     expect(taskList[0].reps).toBe(10);
//   });
//   it('should convert Exercise object to ExerciseType', () => {
//     exercises[0].sets = 3;

//     const taskList = useMapExerciseToTask(exercises);

//     expect(taskList.length).toBe(3);
//     expect(taskList[0].exerciseId).toBe('aaa');
//     expect(taskList[1].exerciseId).toBe('aaa');
//     expect(taskList[2].exerciseId).toBe('aaa');
//     // different IDs
//     expect(taskList[0].id).not.toBe(taskList[1].id);
//     expect(taskList[1].id).not.toBe(taskList[2].id);
//   });
//   it('should be isRest false', () => {
//     exercises[0].sets = 1;

//     const taskList = useMapExerciseToTask(exercises);

//     expect(taskList[0].isRest).toBe(false);
//   });

//   describe('hasRest true', () => {
//     it('should create rest task when hasRest is true', () => {
//       exercises[0].id = '200';
//       exercises[0].hasRest = true;
//       exercises[0].restTime = 10;

//       const taskList = useMapExerciseToTask(exercises);
//       expect(taskList.length).toBe(2);
//       expect(taskList[1].exerciseId).toBe('200');
//       expect(taskList[1].title).toBe('Rest');
//       expect(taskList[1].description).toBe('');
//       expect(taskList[1].isRest).toBe(true);
//     });
//     it('should not have image in rest taske', () => {
//       exercises[0].id = '200';
//       exercises[0].hasRest = true;
//       exercises[0].restTime = 10;

//       const taskList = useMapExerciseToTask(exercises);
//       expect(taskList.length).toBe(2);
//       expect(taskList[1].images.length).toBe(0);
//     });
//     it('should create rest task when hasRest is true', () => {
//       exercises[0].sets = 2;
//       exercises[0].hasRest = true;
//       exercises[0].restTime = 10;

//       const taskList = useMapExerciseToTask(exercises);
//       expect(taskList.length).toBe(4);
//       expect(taskList[0].isRest).toBe(false);
//       expect(taskList[1].isRest).toBe(true);
//       expect(taskList[2].isRest).toBe(false);
//       expect(taskList[3].isRest).toBe(true);
//     });
//   });
// });
