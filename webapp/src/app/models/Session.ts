export interface Session {
  id: string;
  start: Date;
  end: Date;
  sessionRequestIds?: string[];
  liveUSers?: { userId: string; webRtcData: any };
}
