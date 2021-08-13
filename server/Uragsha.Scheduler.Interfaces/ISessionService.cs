﻿using Uragsha.Models.Scheduling;

namespace Uragsha.Scheduler.Interfaces
{
    public interface ISessionService
    {
        Session GetSession(string sessionId);
        Session CreateSession(string sessionRequestId);
        void RemoveSession(string sessionId);
    }
}