export enum SignallingSendEvents {
  SendMessage = 'SendMessage',
  JoinToRoom = 'JoinToRoom',
  RemoveFromRoom = 'RemoveFromRoom',

  Login = 'Login',
  CreateSessionRequest = 'CreateSessionRequest',
  GetUserSessionRequests = 'GetUserSessionRequests',
  CreateSession = 'CreateSession',
  DeleteSessionRequest = 'DeleteSessionRequest',
  OfferVideoCall = 'OfferVideoCall',
  AnswerVideoCall = 'AnswerVideoCall',
  JoinSession = 'JoinSession',
  LeaveSession = 'LeaveSession',
  UpdateSessionDetail = 'UpdateSessionDetail',
  SendIceCandidate = 'SendIceCandidate',
}

