using Scheduler.Interfaces.Models;
using System.Threading.Tasks;

namespace Scheduler.Interfaces.Services
{
    public interface ISessionService
    {
        Task<Session> GetByIdAsync(string sessionId);
        Task<Session> CreateAsync(Session session);
        Task<Session> GetBySessionRequestIdAsync(string sessionRequestId);
        Task RemoveAsync(string sessionId);
    }
}
