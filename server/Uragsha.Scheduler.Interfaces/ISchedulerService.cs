using Uragsha.Models.Scheduling;

namespace Uragsha.Scheduler.Interfaces
{
    public interface ISchedulerService
    {
        Session ScheduleSession(string sessionRequestId);

        Session RescheduleSession(string sessionRequestId);

        void RemoveSession(string sessionRequestId);
    }
}
