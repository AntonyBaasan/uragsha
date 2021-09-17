using Scheduler.Interfaces.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Scheduler.Interfaces.Services
{
    public interface ISessionRequestService
    {
        List<SessionRequest> FindSessionRequest(string userId, DateTime? start = null, DateTime? end = null, SessionRequestStatus? status = null);

        List<SessionRequest> GetSessionRequestsByDate(DateTime start, SessionRequestStatus status);
        SessionRequest GetSessionRequestById(string sessionRequestId);
        Task<SessionRequest> CreateSessionRequestAsync(SessionRequest sessionRequest);
        void UpdateSessionRequest(string sessionRequestId, SessionRequest sessionRequest);
        void RemoveSessionRequest(string sessionRequestId);
    }
}
