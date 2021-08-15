export enum SignallingSendEvents {
  SendMessage = 'SendMessage',
  JoinToRoom = 'JoinToRoom',
  RemoveFromRoom = 'RemoveFromRoom',

  SetMyName = 'SetMyName', // debug
  CreateSessionRequest = 'CreateSessionRequest',
  GetUserSessionRequests = 'GetUserSessionRequests',
  CreateSession = 'CreateSession',
  DeleteSessionRequest = 'DeleteSessionRequest',
  StartOrJoinSession = 'StartOrJoinSession',
  UpdateSessionDetail = 'UpdateSessionDetail',
}
