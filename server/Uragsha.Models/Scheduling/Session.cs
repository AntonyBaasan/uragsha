using System;
using System.Collections.Generic;

namespace Uragsha.Models.Scheduling
{
    public class Session
    {
        public string Id;
        public DateTime Start;
        public DateTime End;
        public List<string> SessionRequestIds { get; set; }
        public Dictionary<string, object> LiveUsers { get; set; }
    }
}
