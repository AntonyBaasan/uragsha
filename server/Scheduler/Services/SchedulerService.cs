using System;
using Scheduler.Interfaces.Services;
using Scheduler.Interfaces.Models;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Email.Interfaces.Services;
using Email.Interfaces.Models;
using Messaging.Interfaces.Services;
using Messaging.Interfaces.Models;
using Microsoft.Extensions.Logging;

namespace Scheduler.Services
{
    public class SchedulerService : ISchedulerService
    {
        private readonly ISessionRequestService sessionRequestService;
        private readonly ISessionService sessionService;
        private readonly IEmailService emailService;
        private readonly IMessageSender messageSender;
        private readonly ILogger<SchedulerService> logger;

        public SchedulerService(
            ISessionRequestService sessionRequestService,
            ISessionService sessionService,
            IEmailService emailService,
            IMessageSender messageSender,
            ILogger<SchedulerService> logger)
        {
            this.sessionRequestService = sessionRequestService;
            this.sessionService = sessionService;
            this.emailService = emailService;
            this.messageSender = messageSender;
            this.logger = logger;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="algorithm">What type of matching algorithm has to be used.</param>
        public async void Schedule(ScheduleAlgorithm algorithm)
        {
            var found = await sessionRequestService.FindWaitingSessionRequest(DateTime.Now.ToUniversalTime(), null);

            logger.LogInformation($"Found {found.Count} non scheduled session requests!");

            var groupByStartDate = found.GroupBy(f => f.Start);
            foreach (var group in groupByStartDate)
            {
                logger.LogInformation($"{group.Count()} session requests found at {group.Key}!");

                SessionRequest previousSessionRequest = null;
                foreach (var sessionRequest in group)
                {
                    if (previousSessionRequest == null)
                    {
                        previousSessionRequest = sessionRequest;
                    }
                    else
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
