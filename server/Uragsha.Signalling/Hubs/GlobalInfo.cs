using Scheduler.Interfaces.Models;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace Uragsha.Signalling.Hubs
{
    // TODO: will move as service
    public static class GlobalInfo
    {
        // TODO: this is temp. variable used for admin
        public static readonly HashSet<string> ConnectedIds = new();

        // TODO: will be moved to some sort of persistancy (ideally Remote Redis Cache)
        public static readonly ConcurrentDictionary<string, SessionDetail> ActiveSessions = new();
    }

}
