using System.Threading.Tasks;

namespace Uragsha.Signalling.Hubs
{
    public interface IClients
    {
        Task OnTextMessage(string message);
        Task OnWebRtcCallRequest(object request);
    }
}
