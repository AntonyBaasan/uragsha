using AutoMapper;
using Entity.Models;
using Scheduler.Interfaces.Models;

namespace Scheduler
{
    public class SchedulerAutoMapperProfile : Profile
    {
        public SchedulerAutoMapperProfile()
        {
            CreateMap<Session, SessionEntity>();
            CreateMap<SessionRequest, SessionRequestEntity>();
            CreateMap<SessionRequestComment, SessionRequestCommentEntity>();

            CreateMap<SessionEntity, Session>();
            CreateMap<SessionRequestEntity, SessionRequest>();
            CreateMap<SessionRequestCommentEntity, SessionRequestComment>();
        }
    }
}
