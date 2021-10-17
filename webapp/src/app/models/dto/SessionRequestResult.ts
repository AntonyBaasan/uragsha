import { SessionRequestStatus, SessionRequestType } from '..';

export interface SessionRequestResult {
  sessionRequestId: string;
  sessionId: string;
  started: Date;
  sessionType: SessionRequestType;
  status: SessionRequestStatus;
  otherUser: {
    userId: string;
    displayName: string;
  }
}


