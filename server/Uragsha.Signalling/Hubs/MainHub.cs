using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace Uragsha.Signalling.Hubs
{
    public class MainHub : Hub<IClients>
    {
        public override Task OnConnectedAsync()
        {
            GlobalInfo.ConnectedIds.Add(Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            GlobalInfo.ConnectedIds.Remove(Context.ConnectionId);
            foreach (var roomName in GlobalInfo.Rooms.Keys)
            {
                GlobalInfo.Rooms[roomName].RemoveAll(value => value.Equals(Context.ConnectionId));
            }
            return base.OnDisconnectedAsync(exception);
        }

        public async Task JoinToRoom(string roomName)
        {
            if (!GlobalInfo.Rooms.ContainsKey(roomName))
            {
                GlobalInfo.Rooms.Add(roomName, new List<string>());
            }
            GlobalInfo.Rooms[roomName].Add(Context.ConnectionId);
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
        }

        public async Task RemoveFromRoom(string roomName)
        {
            if (GlobalInfo.Rooms.ContainsKey(roomName))
            {
                GlobalInfo.Rooms[roomName].RemoveAll(value => value.Equals(Context.ConnectionId));
            }
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);
        }

        public async Task SendMessage(string message)
        {
            await Clients.All.OnTextMessage(message);
        }
    }

}
