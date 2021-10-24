import { SessionRequest } from '..';

export interface SessionRequestComment {
  id: string;
  updatedDate: Date;
  isSuccessfulWorkout: boolean;
  givenSessionRequestId: string;
  receivedSessionRequestId: string;
  givenSessionRequest?: SessionRequest;
  receivedSessionRequest?: SessionRequest;
  comment: string;
}
