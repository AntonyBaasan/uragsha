export interface UserCallMetadata {
  isFit: boolean;
  userState: UserCallStateEnum;
}

export enum UserCallStateEnum {
  waiting = 'waiting',
  joined = 'joined',
  exercising = 'exercising',
  done = 'done',
  left = 'left'

}


