using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Uragsha.Models.Scheduling;
using Uragsha.Scheduler.Interfaces;

namespace Uragsha.Signalling.Hubs
{
    public class MainHub : Hub<IClients>
    {
        public ISessionRequestService SessionRequestService { get; }
        public ISessionService SessionService { get; }

        public MainHub(ISessionRequestService sessionRequestService, ISessionService sessionService)
        {
            SessionRequestService = sessionRequestService;
            SessionService = sessionService;
        }

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
            foreach (var userId in GlobalInfo.UserConnections.Keys)
            {
                GlobalInfo.UserConnections[userId].RemoveAll(value => value.Equals(Context.ConnectionId));
            }

            return base.OnDisconnectedAsync(exception);
        }

        // Debug: until bring auth
        public void SetMyName(string userName)
        {
            if (!GlobalInfo.UserConnections.ContainsKey(userName))
            {
                GlobalInfo.UserConnections.Add(userName, new List<string>());
                GlobalInfo.UserConnections[userName].Add(Context.ConnectionId);
            }
            else
            {
                if (!GlobalInfo.UserConnections[userName].Contains(Context.ConnectionId))
                {
                    GlobalInfo.UserConnections[userName].Add(Context.ConnectionId);
                }
            }
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

        public async Task GetUserSessionRequests(string userId)
        {
            var found = SessionRequestService.FindSessionRequest(userId);
            var connections = GetUserConnections(userId);
            await Clients.Clients(connections).OnGetUserSessionRequests(found);
        }

        public async Task CreateSessionRequest(SessionRequest sessionRequest)
        {
            var request = SessionRequestService.CreateSessionRequest(sessionRequest);

            var connections = GetUserConnections(sessionRequest.UserId);
            await Clients.Clients(connections).OnSessionRequestCreated(request);
        }

        public async Task DeleteSessionRequest(string sessionRequestId)
        {
            // TODO: check if this session is for this user

            var found = SessionRequestService.GetSessionRequestById(sessionRequestId);
            SessionRequestService.RemoveSessionRequest(found.Id);

            var connections = GetUserConnections(found.UserId);
            await Clients.Clients(connections).OnSessionRequestDeleted(found.Id);
        }

        public async Task CreateSession(SessionRequest sessionRequest)
        {
            Session session = SessionService.CreateSession(sessionRequest.Id);

            foreach (var requestId in session.SessionRequestIds)
            {
                SessionRequest request = SessionRequestService.GetSessionRequestById(requestId);

                var connections = GetUserConnections(sessionRequest.UserId);
                await Clients.Clients(connections).OnSessionRequestUpdated(request);
            }
        }


        private List<string> GetUserConnections(string userId)
        {
            GlobalInfo.UserConnections.TryGetValue(userId, out List<string> connections);
            return connections ?? new List<string>();
        }
    }

}
