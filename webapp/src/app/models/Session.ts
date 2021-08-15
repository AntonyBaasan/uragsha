export interface Session {
  id: string;
  start: Date;
  end: Date;
  sessionRequestIds?: string[];
  liveUsers?: { userId: string; webRtcData: any };
}
