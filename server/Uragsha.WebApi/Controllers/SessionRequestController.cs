using HttpUtilities.Services;
using Identity.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Scheduler.Interfaces.Models;
using Scheduler.Interfaces.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Uragsha.WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class SessionRequestController : ControllerBase
    {
        private readonly ILogger<SessionRequestController> _logger;
        private readonly ISessionRequestService sessionRequestService;
        private readonly ISessionService sessionService;
        private readonly IUserService userService;
        private readonly IMatcherService matcherService;
        private readonly IContextService contextService;

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
            this.sessionRequestService = sessionRequestService;
            this.sessionService = sessionService;
            this.userService = userService;
            this.matcherService = matcherService;
            this.contextService = contextService;
        }

        [HttpGet]
        public async Task<IEnumerable<SessionRequest>> Get()
        {
            var userId = contextService.GetUserId();
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
            var found = await sessionRequestService.FindSessionRequest(findSessionRequestArg);
            return found;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var found = await sessionRequestService.GetByIdAsync(id);
            if (found == null)
            {
                return NotFound();
            }
            if (!found.UserId.Equals(contextService.GetUserId()))
            {
                return NotFound();
            }
            return Ok(found);
        }
        // Get session information based on session request id
        [HttpGet("{id}/session/otheruser")]
        public async Task<IActionResult> GetOtherUser(string id)
        {
            var userId = contextService.GetUserId();
            var sessionRequest = await sessionRequestService.GetByIdAsync(id);
            if (sessionRequest == null) { return NotFound(); }
            if (!sessionRequest.UserId.Equals(userId)) { return NotFound(); }

            var session = await sessionService.GetBySessionRequestIdAsync(id);
            if (session == null) { return NotFound(); }
            var otherUserId = session.SessionRequests.First(sr => !sr.UserId.Equals(userId)).UserId;
            var otherUser = await this.userService.GetUserByIdAsync(otherUserId);

            return Ok(otherUser);
        }

        [HttpPost]
        public async Task<SessionRequest> Post([FromBody] SessionRequest sessionRequest)
        {
            sessionRequest.UserId = contextService.GetUserId();
            var created = await sessionRequestService.CreateSessionRequestAsync(sessionRequest);
            return created;
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                var sessionRequest = await sessionRequestService.GetByIdAsync(id);
                var userId = contextService.GetUserId();
                if (sessionRequest != null && sessionRequest.UserId.Equals(userId))
                {
                    await matcherService.UnmatchBySessionRequest(id);
                    await sessionRequestService.RemoveSessionRequest(userId, id);
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
