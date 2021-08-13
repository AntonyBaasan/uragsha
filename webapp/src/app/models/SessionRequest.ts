export interface SessionRequest {
  id: string;
  start: Date;
  end: Date;
  title: string;
  userId: string;
  status: SessionRequestStatus;
  sessionId?: string;

  color: { primary: string; secondary: string };
}

export enum SessionRequestStatus {
  Waiting,
  Scheduled,
}
