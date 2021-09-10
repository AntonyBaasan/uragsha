﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using System.Dynamic;
using Uragsha.Signalling.Dto;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using Identity.Interfaces.Services;
using Scheduler.Interfaces.Services;
using Identity.Interfaces.Models;
using Scheduler.Interfaces.Models;

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
        public override Task OnDisconnectedAsync(Exception exception)
        {
            GlobalInfo.ConnectedIds.Remove(Context.ConnectionId);
            foreach (var userId in GlobalInfo.UserConnections.Keys)
            {
                GlobalInfo.UserConnections[userId].RemoveAll(value => value.Equals(Context.ConnectionId));
            }

            return base.OnDisconnectedAsync(exception);
        }

        public async void AfterLogin(UserDto userDto)
        {
            string uid = this.GetCurrentUid();

            var user = new User
            {
                Id = uid,
                DisplayName = userDto.DisplayName,
                Email = userDto.Email,
                PhotoUrl = userDto.PhotoUrl,
                Plan = UserPlan.Free,
                Status = UserStatus.Active,
                Roles = new List<UserRole> { new UserRole { Name = "User" } }
            };
            if (!await UserService.UserExistAsync(uid))
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

        public async Task OfferVideoCall(string sessionRequestId, object offer)
        {
            var session = SessionService.GetSessionBySessionRequestId(sessionRequestId);

            if (session == null)
            {
                Console.WriteLine("Session doesn't exist!");
                return;
            }
            if (!GlobalInfo.ActiveSession.ContainsKey(session.Id))
            {
                Console.WriteLine("Session detail haven't created. Something went wrong!");
                return;
            }

            GlobalInfo.ActiveSession.TryGetValue(session.Id, out SessionDetail sessionDetail);

            if (sessionDetail.Offer != null)
            {
                Console.WriteLine("Video call is already started. Can't start video call!");
                return;
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, session.Id);

            sessionDetail.Offer = new WebRtcMessage { UserId = GetCurrentUid(), Content = offer };
            dynamic info = new ExpandoObject();
            info.sessionId = session.Id;
            info.sessionDetail = sessionDetail;

            await Clients.GroupExcept(session.Id, new List<string> { Context.ConnectionId }).OnOfferVideoCall(info);
        }

        public async Task AnswerVideoCall(string sessionRequestId, object answer)
        {
            var session = SessionService.GetSessionBySessionRequestId(sessionRequestId);

            if (session == null)
            {
                Console.WriteLine("Session doesn't exist!");
                return;
            }
            if (!GlobalInfo.ActiveSession.ContainsKey(session.Id))
            {
                Console.WriteLine("Session detail haven't created. Something went wrong!");
                return;
            }

            GlobalInfo.ActiveSession.TryGetValue(session.Id, out SessionDetail sessionDetail);

            if (sessionDetail.Answer != null)
            {
                Console.WriteLine("Video call is already started. Can't start!");
                return;
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, session.Id);

            sessionDetail.Answer = new WebRtcMessage { UserId = GetCurrentUid(), Content = answer };
            dynamic info = new ExpandoObject();
            info.sessionId = session.Id;
            info.sessionDetail = sessionDetail;

            await Clients.GroupExcept(session.Id, new List<string> { Context.ConnectionId }).OnAnswerVideoCall(info);
        }

        public async Task JoinSession(string sessionRequestId)
        {
            var userId = GetCurrentUid();
            var sessionRequest = SessionRequestService.GetSessionRequestById(sessionRequestId);
            if (sessionRequest == null)
            {
                Console.WriteLine("Can't find session request by sessionRequestId: " + sessionRequestId);
                return;
            }
            if (sessionRequest.UserId != userId)
            {
                Console.WriteLine("User doesn't belong to session request" + sessionRequestId);
                return;
            }
            var session = SessionService.GetSessionBySessionRequestId(sessionRequestId);
            if (session == null)
            {
                Console.WriteLine("Can't find any session for sessionRequestId: " + sessionRequestId);
                return;
            }
            Console.WriteLine("Session.id: " + session.Id);

            if (!GlobalInfo.ActiveSession.ContainsKey(session.Id))
            {
                var sessionDetail = new SessionDetail { SessionId = session.Id, Started = new DateTime() };
                GlobalInfo.ActiveSession.Add(session.Id, sessionDetail);
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, session.Id);
            await Clients.GroupExcept(session.Id, new List<string> { Context.ConnectionId }).OnUserJoinSession(userId);
        }

        public async Task LeaveSession(string sessionId)
        {
            var userId = GetCurrentUid();
            if (!GlobalInfo.ActiveSession.ContainsKey(sessionId))
            {
                Console.WriteLine("Can't find session with id:" + sessionId);
                return;
            }
            var sessionDetail = GlobalInfo.ActiveSession[sessionId];
            if (sessionDetail.Offer.UserId != userId && sessionDetail.Answer.UserId != userId)
            {
                Console.WriteLine("Trying to leave a session that user doesn't belong!");
                return;
            }

            await Clients.GroupExcept(sessionId, new List<string> { Context.ConnectionId }).OnUserLeaveSession(userId);

            sessionDetail.Answer = null;
            sessionDetail.Offer = null;
            await Clients.GroupExcept(sessionDetail.SessionId, new List<string> { Context.ConnectionId }).OnSessionDetailUpdated(sessionDetail);
        }

        public async Task UpdateSessionDetail(string userId, SessionDetail sessionDetail)
        {
            GlobalInfo.ActiveSession[sessionDetail.SessionId] = sessionDetail;
            await Clients.GroupExcept(sessionDetail.SessionId, new List<string> { Context.ConnectionId }).OnSessionDetailUpdated(sessionDetail);
        }

        public async Task SendIceCandidate(string sessionId, object iceCandidate)
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

            foreach (var request in session.SessionRequests)
            {
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

        private List<UserRole> GetCurrentUserRoles()
        {
            return new List<UserRole>();
        }
    }

}
