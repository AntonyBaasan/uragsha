using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using HttpUtilities.Services;
using Scheduler.Interfaces.Models;
using Scheduler.Interfaces.Services;

namespace Dashboard.Services
{
    public class DashboardService
    {
        private readonly ISessionRequestService sessionRequestService;
        private readonly IContextService contextService;

        public DashboardService(
            ISessionRequestService sessionRequestService,
            IContextService contextService)
        {
            this.sessionRequestService = sessionRequestService;
            this.contextService = contextService;
        }

        // Return all session requests 15 min before current time
        public async Task<IEnumerable<SessionRequest>> GetComingSessionRequests()
        {
            var userId = contextService.GetUserId();
            var filterStartDateFrom = DateTime.UtcNow.AddMinutes(-15);
            var filterStartDateTo = DateTime.UtcNow.AddHours(24);
            var findSessionRequestArg = new FindSessionRequestArgs
            {
                UserId = userId,
                Start1 = filterStartDateFrom,
                Start2 = filterStartDateTo
            };
            var result = await this.sessionRequestService.FindSessionRequest(findSessionRequestArg);
            return result;
        }


        public List<SessionRequest> GetSessionByWeek(DateTime date)
        {
            return new List<SessionRequest>{
                new SessionRequest() { Id="1", Start= new DateTime().AddHours(1)},
                new SessionRequest() { Id="1", Start= new DateTime().AddHours(2)},
                new SessionRequest() { Id="1", Start= new DateTime().AddHours(3)}
            };
        }
    }
}
