export interface SessionDetail {
  sessionId: string;
  started: Date;
  offer: WebRtcMessage;
  answer: WebRtcMessage;
  state: CallStateEnum;
}

export interface WebRtcMessage {
  userId: string;
  content: RTCSessionDescriptionInit;
}

export enum CallStateEnum {
  new,
  inProgress,
  done,
  deleted
}

