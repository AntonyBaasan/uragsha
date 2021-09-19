using Scheduler.Interfaces.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Scheduler.Interfaces.Services
{
    public interface ISessionRequestService
    {
        Task<List<SessionRequest>> FindWaitingSessionRequest(DateTime? start = null, DateTime? end = null);
        Task<List<SessionRequest>> FindSessionRequest(string userId, DateTime? start = null, DateTime? end = null, SessionRequestStatus? status = null);
        Task<List<SessionRequest>> GetSessionRequestsByDate(DateTime start, SessionRequestStatus status);

        Task<SessionRequest> GetByIdAsync(string sessionRequestId);
        Task<SessionRequest> CreateSessionRequestAsync(SessionRequest sessionRequest);
        Task UpdateSessionRequest(SessionRequest sessionRequest);
        Task RemoveSessionRequest(string id);
    }
}
