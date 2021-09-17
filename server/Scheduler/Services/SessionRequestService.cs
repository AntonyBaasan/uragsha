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

        public async Task<SessionRequest> GetSessionRequestById(string sessionRequestId)
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

        public async Task<List<SessionRequest>> FindSessionRequest(string userId, DateTime? start = null, DateTime? end = null, SessionRequestStatus? status = null)
        {
            var result = await _sessionRequestEntityService.FindByUserIdAsync(userId);

            return result.Select(r => _mapper.Map<SessionRequestEntity, SessionRequest>(r)).ToList();

            //var found = requests.Where(r => r.UserId.Equals(userId));
            //if (start != null)
            //{
            //    found = found.Where(r => r.Start >= start);
            //}
            //if (end != null)
            //{
            //    found = found.Where(r => r.End <= end);
            //}
            //if (status.HasValue)
            //{
            //    found = found.Where(r => r.Status.Equals(status));
            //}
            //return found.ToList();
        }

    }
}
