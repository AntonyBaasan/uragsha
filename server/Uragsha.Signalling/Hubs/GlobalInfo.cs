using System.Collections.Generic;

namespace Uragsha.Signalling.Hubs
{
    public static class GlobalInfo
    {
        public static HashSet<string> ConnectedIds = new HashSet<string>();
        public static Dictionary<string, List<string>> Rooms = new Dictionary<string, List<string>>();
    }

}
