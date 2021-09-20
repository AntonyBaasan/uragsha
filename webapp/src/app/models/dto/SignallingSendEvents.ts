export enum SignallingSendEvents {
  SendMessage = 'SendMessage',
  JoinToRoom = 'JoinToRoom',
  RemoveFromRoom = 'RemoveFromRoom',

  AfterLogin = 'AfterLogin',
  CreateSession = 'CreateSession',

  OfferVideoCall = 'OfferVideoCall',
  AnswerVideoCall = 'AnswerVideoCall',
  JoinSession = 'JoinSession',
  LeaveSession = 'LeaveSession',
  
  UpdateSessionDetail = 'UpdateSessionDetail',
  SendIceCandidate = 'SendIceCandidate',
}

