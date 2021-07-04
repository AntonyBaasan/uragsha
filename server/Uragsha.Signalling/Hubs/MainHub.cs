using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Uragsha.Signalling.Hubs
{
    public class MainHub : Hub<IClients>
    {
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            return base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(string message)
        {
            await Clients.All.ReceiveMessage(message);
        }
    }

    public interface IClients
    {
        Task ReceiveMessage(string message);
    }
}
