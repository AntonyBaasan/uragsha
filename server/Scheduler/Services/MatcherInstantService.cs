using Scheduler.Interfaces.Services;
using Scheduler.Interfaces.Models;
using Email.Interfaces.Services;
using Messaging.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace Scheduler.Services
{
    public class MatcherInstantService : MatcherService
    {
        public MatcherInstantService(
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
            var found = await sessionRequestService.FindWaitingIntantSessionRequest();
            Match(algorithm, found);
        }
    }
}
