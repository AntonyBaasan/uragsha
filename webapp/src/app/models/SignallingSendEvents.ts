export enum SignallingSendEvents {
  SendMessage = 'SendMessage',
  JoinToRoom = 'JoinToRoom',
  RemoveFromRoom = 'RemoveFromRoom',

  Login = 'Login',
  CreateSessionRequest = 'CreateSessionRequest',
  GetUserSessionRequests = 'GetUserSessionRequests',
  CreateSession = 'CreateSession',
  DeleteSessionRequest = 'DeleteSessionRequest',
  StartOrJoinSession = 'StartOrJoinSession',
  LeaveSession = 'LeaveSession',
  UpdateSessionDetail = 'UpdateSessionDetail',
  SendIceCandidate = 'SendIceCandidate',
}

