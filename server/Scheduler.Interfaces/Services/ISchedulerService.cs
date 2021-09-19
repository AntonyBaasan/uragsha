using Scheduler.Interfaces.Models;
using System.Threading.Tasks;

namespace Scheduler.Interfaces.Services
{
    public interface ISchedulerService
    {
        public void Schedule(ScheduleAlgorithm algorithm);
            
        Session ScheduleSession(string sessionRequestId);

        Session RescheduleSession(string sessionRequestId);

        Task RemoveSession(string sessionRequestId);

        Task RemoveSessionRequest(string id);
    }
}
