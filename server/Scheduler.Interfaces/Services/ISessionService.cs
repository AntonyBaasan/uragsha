
using Scheduler.Interfaces.Models;

namespace Scheduler.Interfaces.Services
{
    public interface ISessionService
    {
        Session GetSession(string sessionId);
        Session CreateSession(string sessionRequestId);
        Session GetSessionBySessionRequestId(string sessionRequestId);
        void RemoveSession(string sessionId);
    }
}
