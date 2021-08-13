using System.Collections.Generic;

namespace Uragsha.Signalling.Hubs
{
    public static class GlobalInfo
    {
        public readonly static Dictionary<string, List<string>> UserConnections = new();
        public readonly static HashSet<string> ConnectedIds = new();
        public readonly static Dictionary<string, List<string>> Rooms = new();
    }

}
