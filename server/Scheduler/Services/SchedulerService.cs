﻿using System;
using Scheduler.Interfaces.Services;
using Scheduler.Interfaces.Models;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Scheduler.Services
{
    public class SchedulerService : ISchedulerService
    {
        private readonly ISessionRequestService sessionRequestService;
        private readonly ISessionService sessionService;

        public SchedulerService(ISessionRequestService sessionRequestService, ISessionService sessionService)
        {
            this.sessionRequestService = sessionRequestService;
            this.sessionService = sessionService;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="algorithm">What type of matching algorithm has to be used.</param>
        public async void Schedule(ScheduleAlgorithm algorithm)
        {
            var found = await sessionRequestService.FindWaitingSessionRequest(DateTime.Now.ToUniversalTime(), null);

            Console.WriteLine($"Found {found.Count} non scheduled session requests!");

            var groupByStartDate = found.GroupBy(f => f.Start);
            foreach (var group in groupByStartDate)
            {
                Console.WriteLine($"{group.Count()} session requests found at {group.Key}!");

                SessionRequest previousSessionRequest = null;
                foreach (var sessionRequest in group)
                {
                    if (previousSessionRequest == null)
                    {
                        previousSessionRequest = sessionRequest;
                    }
                    else
                    {
                        var session = Match(previousSessionRequest, sessionRequest);
                        //Task.WaitAll(session);
                        Console.WriteLine($"Session {session.Id} was created!");

                        previousSessionRequest = null;
                    }
                }
            }
        }

        private async Task<Session> Match(SessionRequest sessionRequest1, SessionRequest sessionRequest2)
        {
            var newSession = new Session
            {
                Start = sessionRequest1.Start,
                End = sessionRequest1.End,
                SessionRequests = new List<SessionRequest> { sessionRequest1, sessionRequest2 },
                Status = SessionStatus.InProgress
            };

            var session = await sessionService.CreateAsync(newSession);

            sessionRequest1.Status = SessionRequestStatus.Scheduled;
            sessionRequest1.SessionId = session.Id;
            await sessionRequestService.UpdateSessionRequest(sessionRequest1);
            sessionRequest2.Status = SessionRequestStatus.Scheduled;
            sessionRequest2.SessionId = session.Id;
            await sessionRequestService.UpdateSessionRequest(sessionRequest2);

            return session;
        }

        public Session ScheduleSession(string sessionRequestId)
        {
            throw new NotImplementedException();
        }

        public Session RescheduleSession(string sessionRequestId)
        {
            throw new NotImplementedException();
        }

        public async Task RemoveSession(string sessionId)
        {
            var session = await sessionService.GetByIdAsync(sessionId);
            await RemoveSession(session);
        }

        public async Task RemoveSessionRequest(string id)
        {
            var sessionRequest = await sessionRequestService.GetByIdAsync(id);
            if (sessionRequest.SessionId != null)
            {
                var session = await sessionService.GetByIdAsync(sessionRequest.SessionId);
                await RemoveSession(session);
            }
            await sessionRequestService.RemoveSessionRequest(id);
        }

        private async Task RemoveSession(Session session)
        {
            if (session != null)
            {
                foreach (var sessionRequest in session.SessionRequests)
                {
                    // remove reference
                    sessionRequest.SessionId = null;
                    sessionRequest.Session = null;
                    sessionRequest.Status = SessionRequestStatus.Waiting;
                    await sessionRequestService.UpdateSessionRequest(sessionRequest);
                }

                await sessionService.RemoveAsync(session.Id);
            }
        }

    }
}
