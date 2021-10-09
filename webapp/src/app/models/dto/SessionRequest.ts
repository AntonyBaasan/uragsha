export interface SessionRequest {
  id: string;
  start: Date;
  end: Date;
  title: string;
  userId: string;
  sessionType: SessionRequestType;
  status: SessionRequestStatus;
  sessionId?: string;

  color: { primary: string; secondary: string };
  canJoin: boolean;
}

export enum SessionRequestStatus {
  Waiting,
  Scheduled,
  Started,
  Done,
}

export enum SessionRequestType {
  Instant,
  Scheduled,
}
