using System;
using Scheduler.Interfaces.Services;
using Scheduler.Interfaces.Models;
using System.Linq;
using Email.Interfaces.Services;
using Messaging.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace Scheduler.Services
{
    public class MatcherScheduledService : MatcherService
    {
        public MatcherScheduledService(
            ISessionRequestService sessionRequestService,
            ISessionService sessionService,
            IEmailService emailService,
            IMessageSender messageSender,
            ILogger<MatcherService> logger
            ) : base(sessionRequestService, sessionService, emailService, messageSender, logger)
        {
        }

        public override async void Match(MatchAlgorithm algorithm)
        {
            var stillProgressTime = DateTime.Now.ToUniversalTime().AddMinutes(-15);
            var found = await sessionRequestService.FindWaitingScheduledSessionRequest(stillProgressTime, null);

            logger.LogInformation($"Found {found.Count} non scheduled session requests!");

            var groupByStartDate = found.GroupBy(f => f.Start);
            foreach (var group in groupByStartDate)
            {
                logger.LogInformation($"{group.Count()} session requests found at {group.Key}!");

                var sessionRequests = group.AsEnumerable();
                Match(algorithm, sessionRequests);
            }
        }

        public override bool CanMatch(SessionRequest sessionRequest1, SessionRequest sessionRequest2)
        {
            var baseResult = base.CanMatch(sessionRequest1, sessionRequest2);
            if (baseResult == false)
            {
                return false;
            }
            if (!sessionRequest1.Start.Equals(sessionRequest2.Start))
            {
                return false;
            }

            return true;
        }
    }
}
