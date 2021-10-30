using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HttpUtilities.Services;
using Identity.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Scheduler.Interfaces.Models;
using Scheduler.Interfaces.Services;
using Uragsha.WebApi.Dto;

namespace Uragsha.WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SessionRequestController : ControllerBase
    {
        private readonly ILogger<SessionRequestController> _logger;
        private readonly ISessionRequestService _sessionRequestService;
        private readonly ISessionRequestCommentService _sessionRequestCommentService;
        private readonly ISessionService _sessionService;
        private readonly IUserService _userService;
        private readonly IMatcherService _matcherService;
        private readonly IContextService _contextService;

        public SessionRequestController(
            ILogger<SessionRequestController> logger,
            ISessionRequestService sessionRequestService,
            ISessionRequestCommentService sessionRequestCommentService,
            ISessionService sessionService,
            IUserService userService,
            IMatcherService matcherService,
            IContextService contextService
        )
        {
            _logger = logger;
            _sessionRequestService = sessionRequestService;
            _sessionService = sessionService;
            _userService = userService;
            _matcherService = matcherService;
            _contextService = contextService;
            _sessionRequestCommentService = sessionRequestCommentService;
        }

        [HttpGet]
        public async Task<IEnumerable<SessionRequest>> Get()
        {
            var userId = _contextService.GetUserId();
            var findSessionRequestArg = new FindSessionRequestArgs
            {
                UserId = userId,
                Status = new List<SessionRequestStatus>
                {
                    SessionRequestStatus.Waiting,
                    SessionRequestStatus.Scheduled,
                    SessionRequestStatus.Started,
                },
                SessionType = SessionRequestType.Scheduled
            };
            var found = await _sessionRequestService.FindSessionRequest(findSessionRequestArg);
            return found;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var found = await _sessionRequestService.GetByIdAsync(id);
            if (found == null)
            {
                return NotFound();
            }
            if (!found.UserId.Equals(_contextService.GetUserId()))
            {
                return NotFound();
            }
            return Ok(found);
        }
        // Get session information based on session request id
        [HttpGet("{id}/session/otheruser")]
        public async Task<IActionResult> GetOtherUser(string id)
        {
            var userId = _contextService.GetUserId();

            var session = await _sessionService.GetBySessionRequestIdAsync(id);
            if (session == null) { return NotFound(); }
            var isSessionBelongToUser = session.SessionRequests.Any(sr => sr.UserId.Equals(userId));
            if (!isSessionBelongToUser) { return NotFound(); }
            var otherUserId = session.SessionRequests.First(sr => !sr.UserId.Equals(userId)).UserId;
            var otherUser = await _userService.GetUserByIdAsync(otherUserId);

            return Ok(otherUser);
        }

        [HttpGet("{id}/comment")]
        public async Task<IActionResult> GetComment(string id)
        {
            var sessionRequestComment = await _sessionRequestCommentService.GetCommentByGivenSessionRequestId(id);
            if (sessionRequestComment == null) { return NotFound(); }
            return Ok(sessionRequestComment);
        }

        // Get session information based on session request id
        [HttpPost("{id}/comment")]
        public async Task<IActionResult> SetComment(string id, [FromBody] SetCommentRequestDto request)
        {
            var userId = _contextService.GetUserId();

            var session = await _sessionService.GetBySessionRequestIdAsync(id);
            if (session == null) { return NotFound(); }
            var receivedSessionRequest = session.SessionRequests.FirstOrDefault(s => !s.Id.Equals(id));
            if (receivedSessionRequest == null) { return NotFound(); }
            var givenSessionRequest = session.SessionRequests.FirstOrDefault(s => s.Id.Equals(id));
            if (givenSessionRequest == null || !givenSessionRequest.UserId.Equals(userId)) { return NotFound(); }

            var (isSuccessfulWorkout, comment) = request;
            var sessionRequestComment = new SessionRequestComment()
            {
                Id = Guid.NewGuid().ToString(),
                IsSuccessfulWorkout = isSuccessfulWorkout,
                UpdatedDate = DateTime.UtcNow,
                Comment = comment,
                GivenSessionRequestId = id,
                ReceivedSessionRequestId = receivedSessionRequest.Id
            };
            var updated = await _sessionRequestCommentService.SetComment(sessionRequestComment);

            return Ok(updated);
        }

        [HttpPost]
        public async Task<SessionRequest> Post([FromBody] SessionRequest sessionRequest)
        {
            sessionRequest.UserId = _contextService.GetUserId();
            var created = await _sessionRequestService.CreateSessionRequestAsync(sessionRequest);
            return created;
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var sessionRequest = await _sessionRequestService.GetByIdAsync(id);
                var userId = _contextService.GetUserId();
                if (sessionRequest != null && sessionRequest.UserId.Equals(userId))
                {
                    await _matcherService.UnmatchBySessionRequest(id);
                    await _sessionRequestService.RemoveSessionRequest(userId, id);
                }
                else
                {
                    return NotFound();
                }
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }

            return Ok();
        }

    }
}
