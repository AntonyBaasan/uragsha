import { WorkoutState } from './workout';

export interface UserCallMetadata {
  uiLayout: UILayout;
  userInfo: UserInfo;
  workoutState: WorkoutState;
}

export interface UILayout {
  optionValues: OptionValues;
  visibleButtons: OptionsButtons;
  position: 'left' | 'right';
}

export interface OptionsButtons {
  muteMic: boolean;
  muteAudio: boolean;
  fit: boolean;
  options: boolean;
  leave: boolean;
}

export interface OptionValues {
  isFit: boolean;
  isMute: boolean;
}

export interface UserInfo{
  userId: string,
  userName: string,
}

