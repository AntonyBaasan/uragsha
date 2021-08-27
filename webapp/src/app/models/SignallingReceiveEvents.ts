export enum SignallingReceiveEvents {
  OnTextMessage = 'OnTextMessage',

  OnGetUserSessionRequests = 'OnGetUserSessionRequests',
  OnSessionRequestUpdated = 'OnSessionRequestUpdated',
  OnSessionRequestCreated = 'OnSessionRequestCreated',
  OnSessionRequestDeleted = 'OnSessionRequestDeleted',

  OnStartVideoCall = 'OnStartVideoCall',
  OnSessionDetailUpdated = 'OnSessionDetailUpdated',
  OnReceiveIceCandidate = 'OnReceiveIceCandidate',

  OnUserJoinSession = 'OnUserJoinSession',
  OnUserLeaveSession  = 'OnUserLeaveSession',
}
