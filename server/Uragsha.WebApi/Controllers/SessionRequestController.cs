using HttpUtilities.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Scheduler.Interfaces.Models;
using Scheduler.Interfaces.Services;
using System.Collections.Generic;
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
        private readonly IMatcherService matcherService;
        private readonly IContextService contextService;

        public SessionRequestController(
            ILogger<SessionRequestController> logger,
            ISessionRequestService sessionRequestService,
            IMatcherService matcherService,
            IContextService contextService
            )
        {
            _logger = logger;
            this.sessionRequestService = sessionRequestService;
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
                Status = new List<SessionRequestStatus> { SessionRequestStatus.Waiting },
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
