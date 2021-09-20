export interface SessionDetail {
  sessionId: string;
  started: Date;
  offer: WebRtcMessage;
  answer: WebRtcMessage;
}

export interface WebRtcMessage {
  userId: string;
  content: RTCSessionDescriptionInit;
}
