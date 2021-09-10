using System;
using System.Collections.Generic;

namespace Scheduler.Interfaces.Models
{
    public class Session
    {
        public string Id { get; set; }
        public DateTime Start;
        public DateTime End;
        public ICollection<SessionRequest> SessionRequests { get; set; }
        public Dictionary<string, object> LiveUsers { get; set; }
    }
}
