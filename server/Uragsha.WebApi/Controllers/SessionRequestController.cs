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
        private readonly IHttpContextUtils contextUtility;

        public SessionRequestController(
            ILogger<SessionRequestController> logger,
            ISessionRequestService sessionRequestService,
            ISessionService sessionService,
            IUserService userService,
            IHttpContextUtils contextUtility
            )
        {
            _logger = logger;
            this.sessionRequestService = sessionRequestService;
            this.sessionService = sessionService;
            this.userService = userService;
            this.contextUtility = contextUtility;
        }

        [HttpGet]
        public IEnumerable<SessionRequest> Get()
        {
            string uid = this.contextUtility.GetUserId(HttpContext);
            var found = sessionRequestService.FindSessionRequest(uid);
            return found;
        }

        [HttpGet]
        public IActionResult Get(string id)
        {
            string uid = this.contextUtility.GetUserId(HttpContext);
            var found = sessionRequestService.GetSessionRequestById(id);
            if (found == null || found.UserId != uid)
            {
                return NotFound();
            }
            return Ok(found);
        }

        [HttpPost]
        public async Task<SessionRequest> Post([FromBody] SessionRequest sessionRequest)
        {
            var userId = this.contextUtility.GetUserId(this.HttpContext);

            sessionRequest.UserId = userId;
            var created = await sessionRequestService.CreateSessionRequestAsync(sessionRequest);

            return created;
        }

    }
}
