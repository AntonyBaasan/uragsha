using System.Collections.Generic;
using Uragsha.Models.Scheduling;

namespace Uragsha.Signalling.Hubs
{
    public static class GlobalInfo
    {
        public readonly static Dictionary<string, List<string>> UserConnections = new();
        public readonly static HashSet<string> ConnectedIds = new();
        public readonly static Dictionary<string, SessionDetail> ActiveSession = new();
    }

}
