using System;
using Scheduler.Interfaces.Services;
using Scheduler.Interfaces.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Email.Interfaces.Services;
using Email.Interfaces.Models;
using Messaging.Interfaces.Services;
using Messaging.Interfaces.Models;
using Microsoft.Extensions.Logging;

namespace Scheduler.Services
{
    public class MatcherService : IMatcherService
    {
        protected readonly ISessionRequestService sessionRequestService;
        protected readonly ISessionService sessionService;
        protected readonly IEmailService emailService;
        protected readonly IMessageSender messageSender;
        protected readonly ILogger<MatcherService> logger;

        public MatcherService(
            ISessionRequestService sessionRequestService,
            ISessionService sessionService,
            IEmailService emailService,
            IMessageSender messageSender,
            ILogger<MatcherService> logger)
        {
            this.sessionRequestService = sessionRequestService;
            this.sessionService = sessionService;
            this.emailService = emailService;
            this.messageSender = messageSender;
            this.logger = logger;
        }

        public virtual void Match(MatchAlgorithm algorithm)
        {
            throw new InvalidOperationException("Operation is not available!");
        }

        public async void Match(MatchAlgorithm algorithm, IEnumerable<SessionRequest> sessionRequests)
        {
            SessionRequest previousSessionRequest = null;
            foreach (var sessionRequest in sessionRequests)
            {
                if (previousSessionRequest == null)
                {
                    previousSessionRequest = sessionRequest;
                }
                else
                {
                    if (CanMatch(previousSessionRequest, sessionRequest))
                    {
                        var session = await Match(previousSessionRequest, sessionRequest);
                        logger.LogInformation($"Session {session.Id} was created!");
                        previousSessionRequest = null;
                        await SendEmail(session);
                        await SendMessageAfterSessionCreate(session);
                    }
                }
            }
        }

        private bool CanMatch(SessionRequest previousSessionRequest, SessionRequest sessionRequest)
        {
            if (previousSessionRequest.UserId.Equals(sessionRequest.UserId))
            {
                return false;
            }
            return true;
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

        public async Task UnmatchBySession(string sessionId)
        {
            var session = await sessionService.GetByIdAsync(sessionId);
            await RemoveSession(session);
        }

        public async Task UnmatchBySessionRequest(string sessionRequestId)
        {
            var sessionRequest = await sessionRequestService.GetByIdAsync(sessionRequestId);
            if (sessionRequest.SessionId != null)
            {
                var session = await sessionService.GetByIdAsync(sessionRequest.SessionId);
                await RemoveSession(session);
            }
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
                    await NotifySessionRequestUpdate(sessionRequest);
                }

                await sessionService.RemoveAsync(session.Id);
            }
        }

        private async Task SendEmail(Session session)
        {
            try
            {
                var result = await emailService.SendEmailAsync(new EmailInfo
                (
                    new Contact("Uragsha Support", "antony.baasan@gmail.com"),
                    new Contact("Baasandorj", "ankhbayar.baasandorj@gmail.com"),
                    $"Uragsha session scheduled!",
                    $"Session {session.Id} was created!",
                    $"<b>Session {session.Id}</b> was created!"
                ));

                Console.WriteLine($"Email Send: {result}");
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex.StackTrace);
            }
        }

        private async Task SendMessageAfterSessionCreate(Session session)
        {
            foreach (var sessionRequest in session.SessionRequests)
            {
                await NotifySessionRequestUpdate(sessionRequest);
            }
        }

        private async Task NotifySessionRequestUpdate(SessionRequest sessionRequest)
        {
            await messageSender.SendMessageAsync(new HubMessage
            {
                Content = new HubMessageContent
                {
                    ToUserId = new List<string> { sessionRequest.UserId },
                    Method = "OnSessionRequestUpdated",
                    Params = sessionRequest
                }
            });
        }
    }
}
