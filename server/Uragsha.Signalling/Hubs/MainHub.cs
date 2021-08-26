using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Uragsha.Models.Scheduling;
using Uragsha.Scheduler.Interfaces;
using System.Dynamic;
using Uragsha.Signalling.Dto;
using Security.Interfaces.Services;
using Security.Interfaces.Identity;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace Uragsha.Signalling.Hubs
{
    [Authorize]
    public class MainHub : Hub<IClients>
    {
        public ISessionRequestService SessionRequestService { get; }
        public ISessionService SessionService { get; }
        public IUserService UserService { get; }

        public MainHub(ISessionRequestService sessionRequestService,
            ISessionService sessionService,
            IUserService userService)
        {
            SessionRequestService = sessionRequestService;
            SessionService = sessionService;
            UserService = userService;
        }

        public override Task OnConnectedAsync()
        {
            GlobalInfo.ConnectedIds.Add(Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        [AllowAnonymous]
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            GlobalInfo.ConnectedIds.Remove(Context.ConnectionId);
            foreach (var userId in GlobalInfo.UserConnections.Keys)
            {
                GlobalInfo.UserConnections[userId].RemoveAll(value => value.Equals(Context.ConnectionId));
            }

            return base.OnDisconnectedAsync(exception);
        }

        // Debug: until bring auth
        public void Login(UserDto userDto)
        {
            string uid = this.GetCurrentUid();

            var user = new User
            {
                Uid = uid,
                DisplayName = userDto.DisplayName,
                Email = userDto.Email,
                PhotoUrl = userDto.PhotoUrl,
                Plan = UserPlan.Free,
                Status = UserStatus.Active,
            };
            if (UserService.UserExist(uid))
            {
                UserService.AddUser(user);
            }

            if (!GlobalInfo.UserConnections.ContainsKey(uid))
            {
                GlobalInfo.UserConnections.Add(uid, new List<string>());
                GlobalInfo.UserConnections[uid].Add(Context.ConnectionId);
            }
            else
            {
                if (!GlobalInfo.UserConnections[uid].Contains(Context.ConnectionId))
                {
                    GlobalInfo.UserConnections[uid].Add(Context.ConnectionId);
                }
            }
        }

        public async Task StartOrJoinSession(string userId, string sessionRequestId)
        {
            var session = SessionService.GetSessionBySessionRequestId(sessionRequestId);
            Console.WriteLine("Session.id: " + session.Id);

            dynamic info = new ExpandoObject();
            info.sessionId = session.Id;
            if (!GlobalInfo.ActiveSession.ContainsKey(session.Id))
            {
                info.status = "created";
                info.sessionDetail = new SessionDetail { SessionId = session.Id, Started = new DateTime() };
                GlobalInfo.ActiveSession.Add(session.Id, info.sessionDetail);
            }
            else
            {
                info.status = "joined";
                info.sessionDetail = GlobalInfo.ActiveSession[session.Id];
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, session.Id);

            await Clients.Client(Context.ConnectionId).OnStartOrJoinSession(info);
        }

        public async Task UpdateSessionDetail(string userId, SessionDetail sessionDetail)
        {
            GlobalInfo.ActiveSession[sessionDetail.SessionId] = sessionDetail;
            await Clients.GroupExcept(sessionDetail.SessionId, new List<string> { Context.ConnectionId }).OnSessionDetailUpdated(sessionDetail);
        }

        public async Task SendIceCandidate(string userId, string sessionId, object iceCandidate)
        {
            await Clients.GroupExcept(sessionId, new List<string> { Context.ConnectionId }).OnReceiveIceCandidate(iceCandidate);
        }

        public async Task SendMessage(string message)
        {
            await Clients.All.OnTextMessage(message);
        }

        public async Task GetUserSessionRequests()
        {
            string userId = GetCurrentUid();
            var found = SessionRequestService.FindSessionRequest(userId);
            var connections = GetUserConnections(userId);
            await Clients.Clients(connections).OnGetUserSessionRequests(found);
        }

        public async Task CreateSessionRequest(SessionRequest sessionRequest)
        {
            if (string.IsNullOrEmpty(sessionRequest.UserId))
            {
                Console.WriteLine("Uid can't be empty!");
                return;
            }
            var request = SessionRequestService.CreateSessionRequest(sessionRequest);

            var connections = GetUserConnections(sessionRequest.UserId);
            await Clients.Clients(connections).OnSessionRequestCreated(request);

            // TODO: this has to be done in the hosted service
            await CreateSession(request);
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
            if (session == null)
            {
                Console.WriteLine("Can't find matching partner!");
                return;
            }

            foreach (var requestId in session.SessionRequestIds)
            {
                var request = SessionRequestService.GetSessionRequestById(requestId);
                var connections = GetUserConnections(request.UserId);
                await Clients.Clients(connections).OnSessionRequestUpdated(request);
            }
        }

        private List<string> GetUserConnections(string userId)
        {
            GlobalInfo.UserConnections.TryGetValue(userId, out List<string> connections);
            return connections ?? new List<string>();
        }

        private string GetCurrentUid()
        {
            var uid = this.Context.User.Claims.FirstOrDefault(c => c.Type == "user_id");
            return uid != null ? uid.Value : "";
        }
    }

}
