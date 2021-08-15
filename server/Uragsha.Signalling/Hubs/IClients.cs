using System.Collections.Generic;
using System.Threading.Tasks;
using Uragsha.Models.Scheduling;

namespace Uragsha.Signalling.Hubs
{
    public interface IClients
    {
        // Debug
        Task OnTextMessage(string message);

        Task OnWebRtcCallRequest(object request);

        Task OnGetUserSessionRequests(List<SessionRequest> sessionRequests);
        Task OnSessionRequestCreated(SessionRequest sessionRequest);
        Task OnSessionRequestUpdated(SessionRequest sessionRequest);
        Task OnSessionRequestDeleted(string sessionRequestId);

        Task OnStartOrJoinSession(object info);
        Task OnSessionDetailUpdated(SessionDetail sessionDetail);
        
    }
}
