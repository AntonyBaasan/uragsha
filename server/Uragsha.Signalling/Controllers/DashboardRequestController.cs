using Dashboard.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Scheduler.Interfaces.Models;
using System;
using System.Collections.Generic;

namespace Uragsha.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardRequestController : ControllerBase
    {
        private readonly ILogger<SessionRequestController> _logger;
        private readonly DashboardService dashboarService;

        public DashboardRequestController(
            ILogger<SessionRequestController> logger,
            DashboardService dashboarService
            )
        {
            _logger = logger;
            this.dashboarService = dashboarService;
        }

        [HttpGet]
        public IEnumerable<SessionRequest> Get()
        {
            return dashboarService.GetSessionByWeek(new DateTime());
        }

    }
}
