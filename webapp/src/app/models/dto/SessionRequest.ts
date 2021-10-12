export interface SessionRequest {
  id: string;
  title: string;
  start: Date;
  userId: string;
  sessionType: SessionRequestType;
  status: SessionRequestStatus;

  sessionId?: string;
  // TODO: Separate - non Dto related properties
  color: { primary: string; secondary: string };
}

export interface SessionRequestScheduled extends SessionRequest {
  end: Date;
  // TODO: Separate - non Dto related properties
  color: { primary: string; secondary: string };
  canJoin: boolean;
}

export interface SessionRequestInstant extends SessionRequest {
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
