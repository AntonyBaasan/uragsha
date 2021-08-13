using System;
using System.Collections.Generic;
using System.Linq;
using Uragsha.Models.Scheduling;
using Uragsha.Scheduler.Interfaces;

namespace Uragsha.Scheduler.Memory
{
    public class MemorySessionRequestService : ISessionRequestService
    {
        private readonly List<SessionRequest> requests = new();

        public SessionRequest CreateSessionRequest(SessionRequest sessionRequest)
        {
            requests.Add(sessionRequest);
            return sessionRequest;
        }

        public void UpdateSessionRequest(string sessionRequestId, SessionRequest sessionRequest)
        {
            requests.RemoveAll(r => r.Id.Equals(sessionRequestId));
            requests.Add(sessionRequest);
        }

        public List<SessionRequest> FindSessionRequest(string userId, DateTime? start = null, DateTime? end = null, SessionRequestStatus? status = null)
        {
            var found = requests.Where(r => r.UserId.Equals(userId));
            if (start != null)
            {
                found = found.Where(r => r.Start >= start);
            }
            if (end != null)
            {
                found = found.Where(r => r.End <= end);
            }
            if (status.HasValue)
            {
                found = found.Where(r => r.Status.Equals(status));
            }
            return found.ToList();
        }

        public SessionRequest GetSessionRequestById(string sessionRequestId)
        {
            return requests.FirstOrDefault(r => r.Id.Equals(sessionRequestId));
        }

        public List<SessionRequest> GetSessionRequestsByDate(DateTime start, SessionRequestStatus status)
        {
            var found = requests.Where(r => r.Start.Equals(start) && r.Status.Equals(status));
            return found.ToList();
        }

        public void RemoveSessionRequest(string sessionRequestId)
        {
            requests.RemoveAll(r => r.Id.Equals(sessionRequestId));
        }
    }
}
