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
        private readonly IContextService _contextService;
        private readonly ISessionRequestEntityService _sessionRequestEntityService;

        public SessionRequestService(
            ISessionRequestEntityService sessionRequestEntityService,
            IMapper mapper,
            IContextService contextService
        )
        {
            _sessionRequestEntityService = sessionRequestEntityService;
            _mapper = mapper;
            _contextService = contextService;
        }

        public async Task<SessionRequest> CreateSessionRequestAsync(SessionRequest sessionRequest)
        {
            var entity = _mapper.Map<SessionRequest, SessionRequestEntity>(sessionRequest);
            entity.UserId = _contextService.GetUserId();
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
            var userId = _contextService.GetUserId();
            var entity = await _sessionRequestEntityService.GetByIdAsync(sessionRequestId, userId);
            var sessionRequest = _mapper.Map<SessionRequestEntity, SessionRequest>(entity);
            return sessionRequest;
        }

        public async Task RemoveSessionRequest(string id)
        {
            await _sessionRequestEntityService.DeleteAsync(id, _contextService.GetUserId());
        }

        public Task<List<SessionRequest>> GetSessionRequestsByDate(DateTime start, SessionRequestStatus status)
        {
            //var found = requests.Where(r => r.Start.Equals(start) && r.Status.Equals(status));
            //return found.ToList();
            return Task.FromResult(new List<SessionRequest>());
        }

        public async Task<List<SessionRequest>> FindSessionRequest(string userId = null, DateTime? start = null, DateTime? end = null, SessionRequestStatus? status = null, SessionRequestType? sessionType = null)
        {
            var query = new SessionRequestQueryParam
            {
                UserId = userId,
                StartDate = start,
                EndDate = end,
                Status = status != null ? (int)status : null,
                SessionType = sessionType != null ? (int)sessionType : null,
            };
            var result = await _sessionRequestEntityService.FindAsync(query);
            return result.Select(r => _mapper.Map<SessionRequestEntity, SessionRequest>(r)).ToList();
        }

        public async Task<List<SessionRequest>> FindWaitingScheduledSessionRequest(DateTime? start = null, DateTime? end = null)
        {
            return await FindSessionRequest(null, start, end, SessionRequestStatus.Waiting, SessionRequestType.Instant);
        }

        public async Task<List<SessionRequest>> FindWaitingIntantSessionRequest()
        {
            return await FindSessionRequest(null, null, null, SessionRequestStatus.Waiting, SessionRequestType.Scheduled);
        }

    }
}
