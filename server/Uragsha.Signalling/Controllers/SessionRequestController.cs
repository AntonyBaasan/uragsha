using Identity.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Scheduler.Interfaces.Models;
using Scheduler.Interfaces.Services;
using System;
using System.Collections.Generic;
using System.Linq;

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

        public SessionRequestController(
            ILogger<SessionRequestController> logger,
            ISessionRequestService sessionRequestService,
            ISessionService sessionService,
            IUserService userService
            )
        {
            _logger = logger;
            this.sessionRequestService = sessionRequestService;
            this.sessionService = sessionService;
            this.userService = userService;
        }

        [HttpGet]
        public IEnumerable<SessionRequest> Get()
        {
            string uid = GetCurrentUid();
            var found = sessionRequestService.FindSessionRequest(uid);
            return found;
        }

        private string GetCurrentUid()
        {
            var uid = this.HttpContext.User.Claims.FirstOrDefault(c => c.Type == "user_id");
            return uid != null ? uid.Value : "";
        }
    }
}
