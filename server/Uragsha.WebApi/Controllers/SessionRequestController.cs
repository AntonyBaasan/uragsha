using HttpUtilities.Services;
using Identity.Interfaces.Services;
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
        private readonly ISessionService sessionService;
        private readonly IUserService userService;
        private readonly IContextService contextUtility;

        public SessionRequestController(
            ILogger<SessionRequestController> logger,
            ISessionRequestService sessionRequestService,
            ISessionService sessionService,
            IUserService userService,
            IContextService contextUtility
            )
        {
            _logger = logger;
            this.sessionRequestService = sessionRequestService;
            this.sessionService = sessionService;
            this.userService = userService;
            this.contextUtility = contextUtility;
        }

        [HttpGet]
        public async Task<IEnumerable<SessionRequest>> Get()
        {
            string uid = this.contextUtility.GetUserId();
            var found = await sessionRequestService.FindSessionRequest(uid);
            return found;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            var found = await sessionRequestService.GetSessionRequestById(id);
            if (found == null)
            {
                return NotFound();
            }
            return Ok(found);
        }

        [HttpPost]
        public async Task<SessionRequest> Post([FromBody] SessionRequest sessionRequest)
        {
            var created = await sessionRequestService.CreateSessionRequestAsync(sessionRequest);

            return created;
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            try
            {
                await sessionRequestService.RemoveSessionRequest(id);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }

            return Ok();
        }

    }
}
