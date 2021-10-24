using Scheduler.Interfaces.Models;
using Scheduler.Interfaces.Services;
using System.Threading.Tasks;
using Entity.Services;
using AutoMapper;
using Entity.Models;

namespace Scheduler.Services
{
    public class SessionRequestCommentService : ISessionRequestCommentService
    {
        private readonly IMapper _mapper;
        private readonly ISessionRequestCommentEntityService _sessionRequestCommentEntityService;

        public SessionRequestCommentService(
            ISessionRequestCommentEntityService sessionRequestCommentEntityService,
            IMapper mapper
        )
        {
            _sessionRequestCommentEntityService = sessionRequestCommentEntityService;
            _mapper = mapper;
        }


        public async Task<SessionRequestComment> SetComment(SessionRequestComment comment)
        {
            var commentEntity = _mapper.Map<SessionRequestComment, SessionRequestCommentEntity>(comment);
            var found = await _sessionRequestCommentEntityService.GetByGivenSessionRequestId(commentEntity.GivenSessionRequestId);
            if (found != null)
            {
                commentEntity.Id = found.Id;
                await _sessionRequestCommentEntityService.UpdateAsync(commentEntity);
                return _mapper.Map<SessionRequestCommentEntity, SessionRequestComment>(commentEntity);
            }
            else
            {
                var newCommentEntity = await _sessionRequestCommentEntityService.AddAsync(commentEntity);
                return _mapper.Map<SessionRequestCommentEntity, SessionRequestComment>(newCommentEntity);
            }
        }

        public async Task<SessionRequestComment> GetCommentByGivenSessionRequestId(string givenSessionRequestId)
        {
            var sessionsRequestCommentEntity = await _sessionRequestCommentEntityService.GetByGivenSessionRequestId(givenSessionRequestId);
            var sessionsRequestComment = _mapper.Map<SessionRequestCommentEntity, SessionRequestComment>(sessionsRequestCommentEntity);
            return sessionsRequestComment;
        }
    }
}
