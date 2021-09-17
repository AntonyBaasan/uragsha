using System;
using System.Linq;
using Scheduler.Interfaces.Services;
using System.Collections.Generic;
using Scheduler.Interfaces.Models;

namespace Scheduler.Services
{
    public class SchedulerService : ISchedulerService
    {

        public SchedulerService()
        {
        }

        public Session ScheduleSession(string sessionRequestId)
        {
            throw new NotImplementedException();
        }

        public void RemoveSession(string sessionRequestId)
        {
            throw new NotImplementedException();
        }

        public Session RescheduleSession(string sessionRequestId)
        {
            throw new NotImplementedException();
        }

    }
}
