using Scheduler.Interfaces.Models;

namespace Scheduler.Interfaces.Services
{
    public interface ISchedulerService
    {
        Session ScheduleSession(string sessionRequestId);

        Session RescheduleSession(string sessionRequestId);

        void RemoveSession(string sessionRequestId);
    }
}
