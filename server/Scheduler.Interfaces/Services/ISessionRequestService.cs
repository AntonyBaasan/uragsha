using System;
using Scheduler.Interfaces.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Scheduler.Interfaces.Services
{
    public interface ISessionRequestService
    {
        Task<List<SessionRequest>> FindWaitingScheduledSessionRequest(DateTime? start = null, DateTime? end = null);
        Task<List<SessionRequest>> FindWaitingIntantSessionRequest();

        // TODO: make request params as args object instead of passing so many params
        Task<List<SessionRequest>> FindSessionRequest(FindSessionRequestArgs arg);
        Task<List<SessionRequest>> GetSessionRequestsByDate(DateTime start, SessionRequestStatus status);

        Task<SessionRequest> GetByIdAsync(string sessionRequestId);
        Task<SessionRequest> CreateSessionRequestAsync(SessionRequest sessionRequest);
        Task UpdateSessionRequest(SessionRequest sessionRequest);
        Task RemoveSessionRequest(string id);
        Task RemoveSessionRequest(string userId, string id);

        Task SetComment(SessionRequestComment comment);

    }
}
