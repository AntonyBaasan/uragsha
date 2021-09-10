using Scheduler.Interfaces.Models;
using System.Collections.Generic;

namespace Uragsha.Signalling.Hubs
{
    // will move as service
    public static class GlobalInfo
    {
        public readonly static Dictionary<string, List<string>> UserConnections = new();
        public readonly static HashSet<string> ConnectedIds = new();
        public readonly static Dictionary<string, SessionDetail> ActiveSession = new();
    }

}
