using Scheduler.Interfaces.Services;
using Scheduler.Interfaces.Models;
using Email.Interfaces.Services;
using Messaging.Interfaces.Services;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;

namespace Scheduler.Services
{
    public class MatcherInstantService : MatcherService
    {
        public MatcherInstantService(
            ISessionRequestService sessionRequestService,
            ISessionService sessionService,
            IEmailService emailService,
            IMessageSender messageSender,
            ILogger<MatcherInstantService> logger
            ) : base(sessionRequestService, sessionService, emailService, messageSender, logger)
        {
        }

        public override async void Match(MatchAlgorithm algorithm)
        {
            var found = await sessionRequestService.FindWaitingIntantSessionRequest();
            Match(algorithm, found);
        }

        // removes older than 1 hour sessions
        public override async void CollectGarbage()
        {
            var oneHourPassed = DateTime.UtcNow.AddHours(-1);
            var request = new FindSessionRequestArgs
            {
                Start2 = oneHourPassed,
                SessionType = SessionRequestType.Instant,
                Status = new List<SessionRequestStatus> {
                    SessionRequestStatus.Waiting,
                    SessionRequestStatus.Scheduled,
                    SessionRequestStatus.Started
                }
            };
            var foundSessionRequests = await sessionRequestService.FindSessionRequest(request);

            foreach (var sessionRequest in foundSessionRequests)
            {
                logger.LogDebug("Clearing garbage: status changed to DONE " + sessionRequest.Id);
                sessionRequest.Status = SessionRequestStatus.Done;
                await sessionRequestService.UpdateSessionRequest(sessionRequest);
            }
        }
    }
}
