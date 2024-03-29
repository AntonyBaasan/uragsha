﻿using Scheduler.Interfaces.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Uragsha.Signalling.Hubs
{
    public interface IClients
    {
        // Debug
        Task OnTextMessage(string message);

        // Called from messaging.
        Task OnGetUserSessionRequests(List<SessionRequest> sessionRequests);
        Task OnSessionRequestCreated(SessionRequest sessionRequest);
        Task OnSessionRequestUpdated(SessionRequest sessionRequest);
        Task OnSessionRequestDeleted(string sessionRequestId);

        Task OnOfferVideoCall(object info);
        Task OnAnswerVideoCall(object info);
        Task OnWorkoutStateUpdated(string userId, object WorkoutState);
        Task OnSessionDetailUpdated(SessionDetail sessionDetail);
        Task OnReceiveIceCandidate(object iceCandidate);

        Task OnUserJoinSession(string userId);
        Task OnUserLeaveSession(string userId);
    }
}
