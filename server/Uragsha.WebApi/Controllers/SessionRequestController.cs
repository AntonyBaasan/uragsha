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

namespace Uragsha.WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SessionRequestController : ControllerBase
    {
        private readonly ILogger<SessionRequestController> _logger;
        private readonly ISessionRequestService _sessionRequestService;
        private readonly ISessionService _sessionService;
        private readonly IUserService _userService;
        private readonly IMatcherService _matcherService;
        private readonly IContextService _contextService;

        public SessionRequestController(
            ILogger<SessionRequestController> logger,
            ISessionRequestService sessionRequestService,
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
        public IActionResult GetComment(string id)
        {
            return NotFound();
        }

        // Get session information based on session request id
        [HttpPost("{id}/comment")]
        public async Task<IActionResult> InsertComment(string id, [FromBody] SessionRequestComment comment)
        {
            // check if user belon
            var userId = _contextService.GetUserId();

            var session = await _sessionService.GetBySessionRequestIdAsync(comment.GivenSessionRequestId);
            if (session == null) { return NotFound(); }
            var isTargetSessionRequestBelongSession = session.SessionRequests.Any(sr => sr.Id.Equals(comment.ReceivedSessionRequestId));
            if (!isTargetSessionRequestBelongSession)
            {
                return NotFound();
            }
            var givenSessionRequest = session.SessionRequests.FirstOrDefault(sr => sr.Id.Equals(comment.GivenSessionRequestId));
            if (givenSessionRequest == null || !givenSessionRequest.UserId.Equals(userId)) { return NotFound(); }

            await _sessionRequestService.SetComment(comment);

            return Ok(comment);
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
