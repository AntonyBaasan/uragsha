using Scheduler.Interfaces.Models;
using System;
using System.Collections.Generic;

namespace Dashboard.Services
{
    public class DashboardService
    {
        public List<SessionRequest> GetSessionByWeek(DateTime date)
        {
            return new List<SessionRequest>{
                new SessionRequest() { Id="1", Start= new DateTime().AddHours(1)},
                new SessionRequest() { Id="1", Start= new DateTime().AddHours(2)},
                new SessionRequest() { Id="1", Start= new DateTime().AddHours(3)}
            };
        }
    }
}
