using System;
using System.Linq;
using System.Collections.Generic;
using Scheduler.Interfaces.Models;
using Scheduler.Interfaces.Services;
using System.Threading.Tasks;
using Entity.Services;
using AutoMapper;
using Entity.Models;
using HttpUtilities.Services;

namespace Scheduler.Services
{
    public class SessionRequestService : ISessionRequestService
    {
        private readonly IMapper _mapper;
        private readonly ISessionRequestEntityService _sessionRequestEntityService;

        public SessionRequestService(
            ISessionRequestEntityService sessionRequestEntityService,
            IMapper mapper
        )
        {
            _sessionRequestEntityService = sessionRequestEntityService;
            _mapper = mapper;
        }

        public async Task<SessionRequest> CreateSessionRequestAsync(SessionRequest sessionRequest)
        {
            var entity = _mapper.Map<SessionRequest, SessionRequestEntity>(sessionRequest);
            var result = await _sessionRequestEntityService.AddAsync(entity);
            sessionRequest.Id = result.Id;
            return sessionRequest;
        }

        public async Task UpdateSessionRequest(SessionRequest sessionRequest)
        {
            var entity = _mapper.Map<SessionRequest, SessionRequestEntity>(sessionRequest);
            await _sessionRequestEntityService.UpdateAsync(entity);
        }

        public async Task<SessionRequest> GetByIdAsync(string sessionRequestId)
        {
            var entity = await _sessionRequestEntityService.GetByIdAsync(sessionRequestId);
            var sessionRequest = _mapper.Map<SessionRequestEntity, SessionRequest>(entity);
            return sessionRequest;
        }

        public async Task RemoveSessionRequest(string id)
        {
            await _sessionRequestEntityService.DeleteAsync(id);
        }

        public async Task RemoveSessionRequest(string userId, string id)
        {
            await _sessionRequestEntityService.DeleteAsync(id, userId);
        }

        public Task<List<SessionRequest>> GetSessionRequestsByDate(DateTime start, SessionRequestStatus status)
        {
            //var found = requests.Where(r => r.Start.Equals(start) && r.Status.Equals(status));
            //return found.ToList();
            return Task.FromResult(new List<SessionRequest>());
        }

        public async Task<List<SessionRequest>> FindSessionRequest(FindSessionRequestArgs arg)
        {
            var query = new SessionRequestQueryParam
            {
                UserId = arg.UserId,
                StartDate1 = arg.Start1,
                StartDate2 = arg.Start2,
                EndDate1 = arg.End1,
                EndDate2 = arg.End2,
                Status = arg.Status != null ? arg.Status.Select(s => (int)s).ToList() : null,
                SessionType = arg.SessionType != null ? (int)arg.SessionType : null,
            };
            var result = await _sessionRequestEntityService.FindAsync(query);
            return result.Select(r => _mapper.Map<SessionRequestEntity, SessionRequest>(r)).ToList();
        }

        public async Task<List<SessionRequest>> FindWaitingScheduledSessionRequest(DateTime? start = null, DateTime? end = null)
        {
            var findSessionRequestArg = new FindSessionRequestArgs
            {
                Start1 = start,
                Start2 = end,
                Status = new List<SessionRequestStatus> { SessionRequestStatus.Waiting },
                SessionType = SessionRequestType.Scheduled
            };
            return await FindSessionRequest(findSessionRequestArg);
        }

        public async Task<List<SessionRequest>> FindWaitingIntantSessionRequest()
        {
            var findSessionRequestArg = new FindSessionRequestArgs
            {
                Status = new List<SessionRequestStatus> { SessionRequestStatus.Waiting },
                SessionType = SessionRequestType.Instant
            };
            return await FindSessionRequest(findSessionRequestArg);
        }

    }
}
