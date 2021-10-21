using System;
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
    // TODO: move methods to a service
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
            //debug
            GlobalInfo.ConnectedIds.Add(Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        [AllowAnonymous]
        public override Task OnDisconnectedAsync(Exception exception)
        {
            ClearSessionWebRtcInfom();
            //debug
            GlobalInfo.ConnectedIds.Remove(Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }

        private async void ClearSessionWebRtcInfom()
        {
            var userId = GetCurrentUid();
            foreach (var sessionId in GlobalInfo.ActiveSessions.Keys)
            {
                var sessionDetail = GlobalInfo.ActiveSessions[sessionId];
                if ((sessionDetail.Offer != null && sessionDetail.Offer.UserId.Equals(userId))
                    || (sessionDetail.Answer != null && sessionDetail.Answer.UserId.Equals(userId)))
                {
                    await LeaveSession(sessionId);
                }
            }
        }

        public async void AfterLogin(UserDto userDto)
        {
            string uid = this.GetCurrentUid();

            if (!await UserService.UserExistAsync(uid))
            {
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
                UserService.AddUser(user);
            }
        }

        public async void UpdateWorkoutState(string sessionRequestId, object workoutState)
        {
            string userId = this.GetCurrentUid();
            var session = await SessionService.GetBySessionRequestIdAsync(sessionRequestId);
            if (session == null)
            {
                Console.WriteLine("Session doesn't exist!");
                return;
            }
            if (!GlobalInfo.ActiveSessions.ContainsKey(session.Id))
            {
                Console.WriteLine("Session detail haven't created. Something went wrong!");
                return;
            }

            await Clients.GroupExcept(session.Id, new List<string> { Context.ConnectionId }).OnWorkoutStateUpdated(userId, workoutState);
        }

        public async Task OfferVideoCall(string sessionRequestId, object offer)
        {
            var session = await SessionService.GetBySessionRequestIdAsync(sessionRequestId);

            if (session == null)
            {
                Console.WriteLine("Session doesn't exist!");
                return;
            }
            if (!GlobalInfo.ActiveSessions.ContainsKey(session.Id))
            {
                Console.WriteLine("Session detail haven't created. Something went wrong!");
                return;
            }

            GlobalInfo.ActiveSessions.TryGetValue(session.Id, out SessionDetail sessionDetail);

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
            var session = await SessionService.GetBySessionRequestIdAsync(sessionRequestId);

            if (session == null)
            {
                Console.WriteLine("Session doesn't exist!");
                return;
            }
            if (!GlobalInfo.ActiveSessions.ContainsKey(session.Id))
            {
                Console.WriteLine("Session detail haven't created. Something went wrong!");
                return;
            }

            GlobalInfo.ActiveSessions.TryGetValue(session.Id, out SessionDetail sessionDetail);

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
            var sessionRequest = await SessionRequestService.GetByIdAsync(sessionRequestId);
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

            var session = await SessionService.GetBySessionRequestIdAsync(sessionRequestId);
            if (session == null)
            {
                Console.WriteLine("Can't find any session for sessionRequestId: " + sessionRequestId);
                return;
            }

            Console.WriteLine("Session.id: " + session.Id);
            if (!GlobalInfo.ActiveSessions.ContainsKey(session.Id))
            {
                var sessionDetail = new SessionDetail
                {
                    SessionId = session.Id,
                    Started = DateTime.UtcNow,
                    State = CallStateEnum.New,
                };
                // set latest
                GlobalInfo.ActiveSessions.AddOrUpdate(session.Id, sessionDetail, (id, detail) => detail);
            }
            else
            {
                // second user joined
                var sessionDetail = GlobalInfo.ActiveSessions[session.Id];
                await Clients.Client(Context.ConnectionId).OnSessionDetailUpdated(sessionDetail);
            }


            await Groups.AddToGroupAsync(Context.ConnectionId, session.Id);
            await Clients.GroupExcept(session.Id, new List<string> { Context.ConnectionId }).OnUserJoinSession(userId);
        }

        public async Task LeaveSession(string sessionId)
        {
            var userId = GetCurrentUid();
            if (!GlobalInfo.ActiveSessions.ContainsKey(sessionId))
            {
                Console.WriteLine("Can't find session with id:" + sessionId);
                return;
            }
            var sessionDetail = GlobalInfo.ActiveSessions[sessionId];
            if (sessionDetail.Offer?.UserId != userId && sessionDetail.Answer?.UserId != userId)
            {
                Console.WriteLine("Trying to leave a session that user doesn't belong!");
                return;
            }

            await Clients.GroupExcept(sessionId, new List<string> { Context.ConnectionId }).OnUserLeaveSession(userId);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, sessionId);

            Console.WriteLine("Reset webrtc Answer and Offer!");
            sessionDetail.Answer = null;
            sessionDetail.Offer = null;
            sessionDetail.State = CallStateEnum.New;
            await Clients.GroupExcept(sessionDetail.SessionId, new List<string> { Context.ConnectionId }).OnSessionDetailUpdated(sessionDetail);
        }

        public async Task UpdateSessionDetail(SessionDetail sessionDetail)
        {
            GlobalInfo.ActiveSessions[sessionDetail.SessionId] = sessionDetail;
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

        private string GetCurrentUid()
        {
            var uid = this.Context.User.Claims.FirstOrDefault(c => c.Type == "user_id");
            return uid != null ? uid.Value : "";
        }

        // TODO: need impl
        private List<UserRole> GetCurrentUserRoles()
        {
            return new List<UserRole>();
        }
    }

}
