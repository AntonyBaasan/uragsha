using Scheduler.Interfaces.Models;
using System.Threading.Tasks;

namespace Scheduler.Interfaces.Services
{
    public interface ISessionRequestCommentService
    {
        Task<SessionRequestComment> SetComment(SessionRequestComment comment);
        Task<SessionRequestComment> GetCommentByGivenSessionRequestId(string givenSessionRequestId);
    }
}
