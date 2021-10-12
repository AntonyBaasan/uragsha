using Scheduler.Interfaces.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Scheduler.Interfaces.Services
{
    public interface IMatcherService
    {
        public void Match(MatchAlgorithm algorithm);

        public void CollectGarbage();

        public void Match(MatchAlgorithm algorithm, IEnumerable<SessionRequest> sessionRequests);
            
        public Task UnmatchBySession(string sessionId);

        public Task UnmatchBySessionRequest(string sessionRequestId);
    }

}
