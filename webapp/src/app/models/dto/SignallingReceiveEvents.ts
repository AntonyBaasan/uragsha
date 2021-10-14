export enum SignallingReceiveEvents {
  OnTextMessage = 'OnTextMessage',

  OnGetUserSessionRequests = 'OnGetUserSessionRequests',
  OnSessionRequestUpdated = 'OnSessionRequestUpdated',
  OnSessionRequestCreated = 'OnSessionRequestCreated',
  OnSessionRequestDeleted = 'OnSessionRequestDeleted',

  OnOfferVideoCall = 'OnOfferVideoCall',
  OnAnswerVideoCall = 'OnAnswerVideoCall',
  OnWorkoutStateUpdated = 'OnWorkoutStateUpdated',
  OnSessionDetailUpdated = 'OnSessionDetailUpdated',
  OnReceiveIceCandidate = 'OnReceiveIceCandidate',

  OnUserJoinSession = 'OnUserJoinSession',
  OnUserLeaveSession  = 'OnUserLeaveSession',
}
