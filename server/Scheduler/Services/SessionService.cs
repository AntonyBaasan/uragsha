using System;
using System.Linq;
using Scheduler.Interfaces.Services;
using System.Collections.Generic;
using Scheduler.Interfaces.Models;

namespace Scheduler.Services
{
    public class SessionService : ISessionService
    {
        private readonly List<Session> sessions = new();

        public ISessionRequestService SessionRequestService { get; }

        public SessionService(ISessionRequestService sessionRequestService)
        {
            SessionRequestService = sessionRequestService;
        }

        public Session GetSession(string sessionId)
        {
            return sessions.FirstOrDefault(s => s.Id.Equals(sessionId));
        }

        public Session CreateSession(string sessionRequestId)
        {
            var sessionRequest = SessionRequestService.GetSessionRequestById(sessionRequestId);
            // requested session was deleted
            if (sessionRequest == null) { return null; }

            var allRequests = SessionRequestService.GetSessionRequestsByDate(sessionRequest.Start, SessionRequestStatus.Waiting);

            var nextAvailableRequest = allRequests.FirstOrDefault(r => !r.Id.Equals(sessionRequestId));

            // no available request
            if (nextAvailableRequest == null) { return null; }

            var newSession = new Session
            {
                Id = Guid.NewGuid().ToString(),
                Start = sessionRequest.Start,
                End = sessionRequest.End,
                SessionRequests = new List<SessionRequest> { sessionRequest, nextAvailableRequest }
            };

            sessionRequest.Status = SessionRequestStatus.Scheduled;
            sessionRequest.SessionId = newSession.Id;
            SessionRequestService.UpdateSessionRequest(sessionRequest.Id, sessionRequest);
            nextAvailableRequest.Status = SessionRequestStatus.Scheduled;
            nextAvailableRequest.SessionId = newSession.Id;
            SessionRequestService.UpdateSessionRequest(nextAvailableRequest.Id, nextAvailableRequest);

            sessions.Add(newSession);
            return newSession;
        }

        public void RemoveSession(string sessionId)
        {
            sessions.RemoveAll(s => s.Id.Equals(sessionId));
        }

        public Session GetSessionBySessionRequestId(string sessionRequestId)
        {
            var result = sessions.FirstOrDefault(session => session.SessionRequests.Any(s => s.Id.Equals(sessionRequestId)));
            return result;
        }
    }
}
