using System;
using System.Collections.Generic;
using Uragsha.Models.Scheduling;

namespace Uragsha.Scheduler.Interfaces
{
    public interface ISessionRequestService
    {
        List<SessionRequest> FindSessionRequest(string userId, DateTime? start = null, DateTime? end = null, SessionRequestStatus? status = null);

        List<SessionRequest> GetSessionRequestsByDate(DateTime start, SessionRequestStatus status);
        SessionRequest GetSessionRequestById(string sessionRequestId);
        SessionRequest CreateSessionRequest(SessionRequest sessionRequest);
        void UpdateSessionRequest(string sessionRequestId, SessionRequest sessionRequest);
        void RemoveSessionRequest(string sessionRequestId);
    }
}
