export interface UserCallMetadata {
  callState: CallStateEnum;
  isFit: boolean;
  isMute: boolean;
  uiLayout: UILayout;
  workout: string[]
}

export interface UILayout {
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

export enum CallStateEnum {
  waiting = 'waiting',
  joined = 'joined',
  exercising = 'exercising',
  done = 'done',
  left = 'left'
}


