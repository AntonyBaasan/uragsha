using System;
using System.Linq;
using Scheduler.Interfaces.Services;
using System.Collections.Generic;
using Scheduler.Interfaces.Models;
using Entity.Services;
using AutoMapper;
using Entity.Models;
using System.Threading.Tasks;

namespace Scheduler.Services
{
    public class SessionService : ISessionService
    {
        private readonly ISessionEntityService sessionEntityService;
        private readonly IMapper mapper;

        public SessionService(
            ISessionEntityService sessionEntityService,
            IMapper mapper
        )
        {
            this.sessionEntityService = sessionEntityService;
            this.mapper = mapper;
        }

        public async Task<Session> GetByIdAsync(string sessionId)
        {
            var entity = await sessionEntityService.GetByIdAsync(sessionId);
            return mapper.Map<SessionEntity, Session>(entity);
        }

        public async Task<Session> CreateAsync(Session session)
        {
            var entity = mapper.Map<Session, SessionEntity>(session);
            entity = await sessionEntityService.AddAsync(entity);
            session.Id = entity.Id;
            return session;
        }

        public async Task RemoveAsync(string sessionId)
        {
            await sessionEntityService.DeleteAsync(sessionId);
        }

        public async Task<Session> GetBySessionRequestIdAsync(string sessionRequestId)
        {
            var entity = await sessionEntityService.GetBySessionRequestIdAsync(sessionRequestId);
            return mapper.Map<SessionEntity, Session>(entity);
        }

        public async Task<Session> UpdateAsync(Session session)
        {
            var entity = mapper.Map<Session, SessionEntity>(session);
            await sessionEntityService.UpdateAsync(entity);
            return session;
        }
    }
}
